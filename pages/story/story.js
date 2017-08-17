Page({
  data: {
    current_story: '',
    page_id: '0',
    textdata: "put value",
    isLastPage: false
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
      path: '/pages/story',
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
      current_story: story_id
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
    var url = 'http://localhost:3000/stories/' + '2' + '/pages/' + page_id;
    wx.request({
      url: url,
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data);
        that.setData({ textdata: res.data });
        that.setData({ isLastPage: that.checkIfLastPage()})
      },
      fail: function (res) {
      },
    });
  },
  A: function (e) {
    var nextPageId = e.currentTarget.dataset.nextpageid  //this.data.textdata.links[0].nextPageId
    var url = '../story/story?story_id=' + this.data.current_story + '&page_id=' + nextPageId
    // var url = 'http://localhost:3000' + this.data.textdata.links[0].path
    wx.redirectTo({
      url: url
    })
  },
  
  checkIfLastPage(){
    var length = this.data.textdata.links.filter(function (link) {
      return link.nextPageId != null;
    }).length

    return length == 0;
  }
})