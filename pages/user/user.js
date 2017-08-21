var host = getApp().globalData.host

// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stories: {},
    keys:{},
    host
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    try {
      var stories = wx.getStorageSync('stories');
      if (stories) {
        console.log(stories);
        // add key to old stories obj
        var sorted_keys = Object.keys(stories).sort( (a,b)=> (a-b));
        console.log(sorted_keys);
        that.setData({stories: stories,keys:sorted_keys});
      } 
    } catch (e) {
      // Do something when catch error
      console.log(e);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onTap(e){
    var current_url = e.currentTarget.dataset.currentUrl;
    wx.navigateTo({
      url: current_url
    })
  }
})