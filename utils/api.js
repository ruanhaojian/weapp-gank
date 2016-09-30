
var StringUtils = require('StringUtils.js');

var API = {
    TIPS: {
        ERROR_DATA: '请求数据出错'
    },
    BASE_URL : "http://gank.io/api",
    URL : {
        gankData : "{random}/data/{catogory}/{count}/{page}"
    },
    getGankData : function(options){

        var _this = this;

        var _options = {
            data: {
                page: 1,
                count: 10,
                catogory: 'all',
                random: ''
            },
            success: function(){},
            error: function(){}
        }

        for(var key in options){
            if(key !== 'data'){
                _options[key] = options[key];
            }
        }

        for(var key in options.data){
            _options.data[key] = options.data[key];
        }

        _options.data.random = options.isRandom ? "/rondom" : "";

        wx.request({
            url: this.BASE_URL + new StringUtils(this.URL.gankData).format(_options.data),
            header: {
                "Content-Type": "application/json"
            },
            success: function (res) {
                if (res == null ||
                    res.data == null ||
                    res.data.results == null ||
                    res.data.results.length <= 0) {

                    console.error(_this.TIPS.ERROR_DATA);
                    return;
                }
                
                _options.success && _options.success(res);
            },
            fail: function(e){
                console.error(e);
                _options.error && _options.error(e);
            }
        });
        
    }
}

module.exports = API;