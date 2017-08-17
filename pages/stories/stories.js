Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    textdata: "put value",
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    wx.request({
      url: 'http://localhost:3000/stories.json',
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        that.setData({textdata:res.data});
      },
      fail: function (res) {
      },
    });
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  tz: function (e) {
    var arrayIndex = e.target.id;
    var story_id = this.data.textdata[arrayIndex].id;
    var root_page_id = this.data.textdata[arrayIndex].root_page_id;
    var url = '../story/story?story_id=' + story_id + '&page_id=' + root_page_id

    wx.navigateTo({
      url: url
    })
  }
})