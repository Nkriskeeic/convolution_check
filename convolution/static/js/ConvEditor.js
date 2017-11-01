/**
 * Created by shun on 2017/09/28.
 */


const idIte = idIterator();

const AddConvolution = function () {
    let conv_layer_pane = $("#conv_layers");
    const convolution = genConvolution(idIte.next());
    conv_layer_pane.append(convolution);
};

const DelConvolution = function (conv_index) {
    let convolution = $("#conv" + conv_index);
    convolution.remove();
};

const ClearConvolutions = function () {
    let conv_layer_pane = $("#conv_layers");
    conv_layer_pane.empty();
    $("#node_pane").empty();
    idIte.reset();
};

function idIterator() {
    let nextIndex = 0;
    return {
        next: function () {
            return nextIndex++;
        },
        reset: function () {
            nextIndex = 0;
        }
    };
}

const genConvolution = function (conv_index) {
    //   return `<form class='conv-layer form-inline' id='conv${conv_index}'>
    //               <span class="conv-id col-sm-2">conv${conv_index}</span>
    //                   <label>k_width<input class='input-xmini' id='c${conv_index}_kw' type='number' value='3'></label>
    //                   <label>k_height<input class='input-xmini' id='c${conv_index}_kh' type='number' value='3'></label>
    //                   <label>stride<input class='input-xmini' id='c${conv_index}_stride' type='number' value='1'></label>
    //                   <label>dilate<input class='input-xmini' id='c${conv_index}_dilate' type='number' value='1'></label>
    //                   <button class="btn btn-danger" type="button"
    // onclick="DelConvolution(${conv_index})">削除</button>
    //               </form>`;
    return `<form class="conv-layer form-inline"  id='conv${conv_index}'>
                 <span class="conv-id">conv${conv_index} </span>
  <div class="form-group">
     <label for="c${conv_index}_kw"> k_width : </label>
     <input class='input-xmini' id='c${conv_index}_kw' type='number' value='3'></label>
  </div>
  <div class="form-group">
     <label for="c${conv_index}_kh"> k_height : </label>
     <input class='input-xmini' id='c${conv_index}_kh' type='number' value='3'></label>
  </div>
  <div class="form-group">
     <label for="c${conv_index}_stride">stride : </label>
     <input class='input-xmini' id='c${conv_index}_stride' type='number' value='1'></label>
  </div>
  <div class="form-group">
     <label for="c${conv_index}_dilate">dilate : </label>
     <input class='input-xmini' id='c${conv_index}_dilate' type='number' value='1'></label>
  </div>
  <button type="submit" class="btn btn-danger" onclick="DelConvolution(${conv_index})">削除</button>
</form>`;
};