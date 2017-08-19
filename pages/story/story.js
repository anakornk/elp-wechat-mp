var host = getApp().globalData.host

Page({
  data: {
    story_id: '',
    page_id: '0',
    textdata: "put value",
    isLastPage: false,
    isImage:false,
    host
  },
  onLoad: function (e) {
    //get window width and height
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    //save story id and page id
    var story_id = e.story_id;
    var page_id = e.page_id;
    this.setData({
      story_id: story_id,
      page_id: page_id
    })

    //send request and grab current page data
    var url = host + '/api/v1/stories/' + story_id + '/pages/' + page_id;
    var current_url = '../story/story?story_id=' + story_id + '&page_id=' + page_id
    wx.request({
        url: url,
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log(res.data);
          that.setData({ textdata: res.data });
          that.setData({ 
            isLastPage: that.checkIfLastPage(),
            isImage: that.checkIfImage()
          });
        },
        fail: function (res) {
        },
      });

    // save start
    wx.setStorageSync('key', current_url)
    // save end
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('audioPlayer')
  },
  buttonClicked: function (e) {
    var nextPageId = e.currentTarget.dataset.nextpageid  //this.data.textdata.links[0].nextPageId
    var url = '../story/story?story_id=' + this.data.story_id + '&page_id=' + nextPageId
      wx.redirectTo({
        url: url
      })
  },

  checkIfLastPage() {
    var length = this.data.textdata.links.filter(function (link) {
      return link.dst_page_id != null;
    }).length
    return length == 0;
  },
  checkIfImage(){
    var arr = this.data.textdata.image_video_url.split('.');
    var fileExtension = arr[arr.length-1];
    return (['jpg','png','jpeg'].includes(fileExtension.toLowerCase()))
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: 'Send to friends!',
      path: '/pages/story/story?story_id=' + this.data.story_id + '&page_id=' + this.data.page_id,
      success: function (res) {

      },
      fail: function (res) {
      }
    }
  },
  audioPlay(){
    this.audioCtx.play();
  }
})