
Page({
  data: {
    current_story: '',
    page_id: '0',
    textdata: "put value",
    isLastPage: false,
    host: "https://elp-story-maker.herokuapp.com"
  },
  listenerButtonPlay: function () {
    wx.playBackgroundAudio({
      dataUrl: 'http://www.kozco.com/tech/organfinale.wav',
      title: 'testing',
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: 'Send to friends!',
      path: '/pages/story/story?story_id=' + this.data.current_story + '&page_id=' + this.data.page_id,
      success: function (res) {

      },
      fail: function (res) {
      }
    }
  },
  onLoad: function (e) {
    var story_id = e.story_id;
    var page_id = e.page_id;
    this.setData({
      current_story: story_id,
      page_id: page_id
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    var url = this.data.host + '/api/v1/stories/' + story_id + '/pages/' + page_id;
    var current_url = '../story/story?story_id=' + this.data.current_story + '&page_id=' + page_id
    
    // save start
    wx.setStorageSync('key', current_url),
    // save end
    wx.request({
      url: url,
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data);
        that.setData({ textdata: res.data });
        console.log(that.data.host + that.data.textdata.image_url)
        that.setData({ isLastPage: that.checkIfLastPage() })
      },
      fail: function (res) {
      },
    });
  },
  A: function (e) {
    var nextPageId = e.currentTarget.dataset.nextpageid  //this.data.textdata.links[0].nextPageId
    var url = '../story/story?story_id=' + this.data.current_story + '&page_id=' + nextPageId
      wx.redirectTo({
        url: url
      })
  },

  checkIfLastPage() {
    var length = this.data.textdata.links.filter(function (link) {
      return link.dst_page_id != null;
    }).length

    return length == 0;
  }
})