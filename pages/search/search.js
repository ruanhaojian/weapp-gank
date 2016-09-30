//search.js
//获取应用实例
var app = getApp()
var API = require('../../utils/api.js')

Page({
  data: {
    isLoading: false,
    typeArray: ['all','Android','iOS','福利','App','拓展资源','前端','瞎推荐'],
    index: 3,
    items: []
  },
  onLoad: function () {
    var _this = this;

    console.log('search onLoad')
    this.searchData();
  },
  searchData: function(){

    var _this = this;

    this.setData({
      isLoading: true
    })

    this.setData({
      items: []
    })

    API.getGankData({
      data:{
        catogory: this.data.typeArray[this.data.index]
      },
      success: function(res){

        res.data.results.map(function(item){
  	      item.url = item.url.replace('//ww', '//ws');
          return item;
        })

        _this.setData({
          items: res.data.results
        })
        console.dir(res.data.results)

        _this.setData({
          isLoading: false
        })
      },
      error: function(e){
        _this.setData({
          isLoading: false
        })
      }
    });

  },
  loadingChange: function(){

  },
  bindPickerChange: function(e){
    this.setData({
      index: e.detail.value
    })
    this.searchData();
  }
})
