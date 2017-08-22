//app.js
App({

  onLaunch: function() {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // var last_page = wx.getStorageSync(key)
    this.login();
  },
  
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }

  },

  globalData: {
    userInfo: null,
    host: 'http://172.16.102.78:3000'
  },
  onShow(){
    console.log("onshow");
    //login
    var that = this;
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log("session success");
        try {
          var third_session = wx.getStorageSync('3rd_session');
          that.globalData.third_session = third_session;
          console.log("globaldata session")
        }
        catch (e) {
          console.log(e);
        }
      },
      fail: function () {
        //登录态过期
        this.login();
      }
    });
  },
  login(){
    console.log("login test");
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code);
          //发起网络请求
          wx.request({
            url: that.globalData.host + '/api/v1/wechatusers/login',
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.error != undefined) {
                //error
                console.log("login error");
              } else {
                //not error
                try {
                  wx.setStorageSync('3rd_session', res.data.third_session);
                }
                catch (e) {
                  console.log(e);
                }
              }

            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    //login
  }
})
