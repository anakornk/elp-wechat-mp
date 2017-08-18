
Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: 'Send to friends!',
      path: '/pages/stories',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    textdata: "put value",
    host: "http://localhost:3000"
  },
  onLoad: function () {

    wx.setNavigationBarTitle({
      title: ' 大象故事',
    })
    var last_page = wx.getStorageSync('key')
    if (last_page) {
      wx.navigateTo({
        url: last_page,
      })
    }

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
      url: this.data.host + '/api/v1/stories',
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        that.setData({ textdata: res.data });
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
  },
  loadData() {
    console.log("load data");
  },
  onPullDownRefresh: function () {
    console.log("pulldown")
    wx.stopPullDownRefresh()
    this.loadData()
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1500
    })
  },
})