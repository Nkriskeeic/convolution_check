from django.conf.urls import url
from convolution import views

urlpatterns = [
    url(r'^index/$', views.index, name='conv_index'),   # 一覧
    url(r'^add/$', views.add, name='conv_add'),  # 登録
]