//search.js
//获取应用实例
var app = getApp()
var API = require('../../utils/api.js')

Date.prototype.format = function (fmt) { //author: meizz
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds(), //毫秒
            "w": Week[this.getDay()]
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

Page({
  data: {
    loadingHidden: true,
    typeArray: ['all','Android','iOS','福利','App','拓展资源','前端','瞎推荐'],
    index: 3,
    items: [],
    btnLoading: false,
    page : 1,
    modalHidden: true,
    imageUrl:'',
    toastHidden: true,

  },
  onLoad: function () {
    var _this = this;

    console.log('search onLoad')
    this.searchData();
  },
  searchData: function(){

    var _this = this;

    this.setData({
      btnLoading: true
    })

    // this.setData({
    //   items: []
    // })

    API.getGankData({
      data:{
        catogory: this.data.typeArray[this.data.index],
        page : this.data.page
      },
      success: function(res){

        if(_this.data.typeArray[_this.data.index] != '福利'){
          res.data.results.map(function(item){
            var date = new Date(item.publishedAt);
            item.publishedAt = date.format('yyyy-MM-dd');
            return item;
          })
        }else{
          res.data.results.map(function(item){
            item.url = item.url.replace('//ww', '//ws');
            return item;
          })
        }
        
        if(_this.data.page > 1){
          res.data.results = _this.data.items.concat(res.data.results);
        }

        _this.setData({
          items: res.data.results
        })
        console.dir(res.data.results)

        _this.setData({
          btnLoading: false
        })
      },
      error: function(e){
        _this.setData({
          btnLoading: false
        })
      }
    });

  },
  loadingChange: function(){

  },
  bindPickerChange: function(e){
    this.setData({
      index: e.detail.value,
      items: [],
      page: 1
    })
    this.searchData();
  },
  loadMore: function(){
    this.setData({
      page: this.data.page + 1
    })
    this.searchData();
  },
  imgTab: function(e){
    
    this.setData({
      modalHidden: false,
      imageUrl: e.target.dataset.imgUrl
    })

  },
  onCancelClick: function(){
    this.setData({
      modalHidden: true,
      imageUrl: ''
    })
  },
  onSaveClick: function(){
    saveIamge();
  },
  toastChange: function (event) {
    this.setData({toastHidden: true});
  }
})

function saveIamge() {
    var appInstance = getApp();
    var that = appInstance.getCurrentPage();
    that.setData({
        loadingHidden: false,
        toastHidden: true,
        modalHidden: true,
        loadingText: "下载中..."
    });
    wx.downloadFile({
        url: that.data.imageUrl,
        type: 'image',
        success: function (res) {
            console.log("download success");
            that.setData({
                loadingHidden: true,
                toastHidden: false,
                toastText: "图片已成功下载"
            });
        },
        fail: function (res) {
            console.log("download fail");
            that.setData({
                loadingHidden: true,
                toastHidden: false,
                toastText: "下载失败，请重试"
            });
        },
    })
}