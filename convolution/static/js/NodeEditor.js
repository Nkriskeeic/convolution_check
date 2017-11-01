let drawer = null;

const Draw = function () {
    const convolutions = GenConvolutions();
    const visible_areas = GenVisibleFields(convolutions);
    drawer = new DrawFields(visible_areas);
    drawer.init();
};

const DrawNext = function () {
    if (drawer === null) {
        Draw();
    }
    drawer.next();
};

const DrawPrev = function () {
    if (drawer === null) {
        Draw();
    }
    drawer.prev();
};
const _DrawHiddenFields = function (fields) {
        const pane = $("#node_pane");
        pane.empty();
        for (let f_i in fields) {
            if (!fields.hasOwnProperty(f_i)) {
                continue;
            }
            const field_h = fields[f_i][0].map(function (x) {return [x]});
            const field = math.multiply(field_h, [fields[f_i][1]]);
            const max_val = Math.max(...field.map(sub => Math.max(...sub)));
            const row_cnt = field.length;
            const col_cnt = field[0].length;
            const max_width = 200;
            const max_height = max_width * (row_cnt / col_cnt);
            const node_size = max_width / col_cnt;
            const this_field = $("<div id='node_pane_" + f_i + "'>");
            this_field.hide();
            const svg = d3.select(this_field.get(0))
                .append("svg")
                .attr("width", max_width)
                .attr("height", max_height);

            for (let r = 0; r < row_cnt; r++) {
                for (let c = 0; c < col_cnt; c++) {
                    let color_val = 255  *  (field[r][c] / max_val);
                    if (color_val > 0 && color_val < 40) {
                        color_val = 40; //暗すぎて見えないので
                    }
                    const color = d3.rgb(color_val, color_val, color_val);
                    svg
                        .append("rect")
                        .attr("x", c * node_size)
                        .attr("y", r * node_size)
                        .attr("width", node_size) // 横幅を指定
                        .attr("height", node_size)    // 縦幅を指定
                        .attr("stroke", "black") // 枠線は黒色にする
                        .attr("fill", color)
                        .attr("stroke-width", 1);
                }
            }
            const message = '<div><span>' + row_cnt + ' × ' + col_cnt + '</span></div>';
            this_field.append(message);
            pane.append(this_field);
        }
        const btn = '<div>' +
            '<button class="btn btn-success" type="button" onclick="DrawPrev()">← prev</button>' +
            '<button class="btn btn-success" type="button" onclick="DrawNext()">next →</button>' +
            '</div>';
        pane.append(btn);
    };

const DrawFields = function (visible_areas) {
    let index = 0;
    const len = visible_areas.length;
    _DrawHiddenFields(visible_areas);
    const conv_layers = $('#conv_layers');
    assertion = (conv_layers.children().length !== len);
    const change = function (change_val) {
        $("#node_pane_" + index).hide();
        conv_layers.children(`form:nth-child(${index + 1})`).find('.conv-id').removeClass("conv-id-selected");
        index = (index + len + change_val) % len;
        conv_layers.children(`form:nth-child(${index + 1})`).find('.conv-id').addClass("conv-id-selected");
        $("#node_pane_" + index).show();
    };
    return {
        init: function () {
            if (assertion) {
                return false;
            }
            $("#node_pane_0").show();
            conv_layers.children('form:first').find('.conv-id').addClass("conv-id-selected");
        },
        next: function () {
            if (assertion) {
                return false;
            }
            change(1);
        },
        prev: function () {
            if (assertion) {
                return false;
            }
            change(-1);
        }
    };
};

const Convolution = function (k_width, k_height, stride, dilate) {
    this.kw = Number(k_width);
    this.kh = Number(k_height);
    this.stride = Number(stride);
    this.pad = Number(1);
    this.dilate = Number(dilate);
};

const GenConvolutions = function () {
    const convolutions = [];
    $('.conv-layer').each(function () {
        ind = this.id.slice(-1);
        convolutions.push(GenConvolution(ind));
    });
    return convolutions;
};

const GenConvolution = function (index) {
    const prefix = '#c' + index + '_';
    const kw = $(prefix + 'kw').val();
    const kh = $(prefix + 'kh').val();
    const stride = $(prefix + 'stride').val();
    const padding = $(prefix + 'dilate').val();
    return new Convolution(kw, kh, stride, padding);
};

// const Map = function (w, h) {
//     const map = new Array(h);
//     for (y = 0; y < h; y++) {
//         map[y] = new Array(w).fill(0);
//     }
//     return map;
// };


const VisibleField = function (conv, pre_conv, pre_field_h, pre_field_w) {

    const conv_w = conv.kw;
    const conv_h = conv.kh;
    const conv_dilate = conv.dilate;
    const pre_w = pre_field_w.length;
    const pre_h = pre_field_h.length;
    const pre_stride = pre_conv.stride;

    //幅と高さを予め出しておく
    const width = ((conv_w - 1) * conv_dilate) * pre_stride + pre_w;
    const height = ((conv_h - 1) * conv_dilate) * pre_stride + pre_h;

    let kernel_h = (new Array(height)).fill(0);
    let kernel_w = (new Array(width)).fill(0);

    //視野計算　一列目と一行目だけ計算する
    for (let h = 0; h < conv_h; ++h) {
        pos_h = h * conv_dilate;
        for (let _h = 0; _h < pre_h; ++_h) {
            kernel_h[pos_h * pre_stride + _h] += pre_field_h[_h];
        }
    }

    for (let w = 0; w < conv_w; ++w) {
        pos_w = w * conv_dilate;
        for (let _w = 0; _w < pre_w; ++_w) {
            kernel_w[pos_w * pre_stride + _w] += pre_field_w[_w];
        }
    }


    // for (let h = 0; h < conv_h; h++) {
    //     pos_h = h * conv_dilate;
    //     for (let w = 0; w < conv_w; w++) {
    //         pos_w = w * conv_dilate;
    //         for (_h = 0; _h < pre_h; _h++) {
    //             for (_w = 0; _w < pre_w; _w++) {
    //                 kernel[pos_h * pre_stride + _h][pos_w * pre_stride + _w] += pre_field[_h][_w];
    //             }
    //         }
    //     }
// }
// kernel = kernel.map(function (h) {
//     return h.map(function (w) {
//         return Math.min(w, 255);
//     });
// });
    return [kernel_h, kernel_w];
};

const GenVisibleFields = function (convolutions) {
    const visible_areas = [];
    let prev_conv = new Convolution(1, 1, 1, 1);
    let prev_field = [[1], [1]];
    $.each(convolutions, function () {
        const this_field = VisibleField(this, prev_conv, prev_field[0], prev_field[1]);
        visible_areas.push(this_field);
        prev_conv = this;
        prev_field = this_field;
    });
    return visible_areas;
};
/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
