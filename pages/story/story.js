var host = getApp().globalData.host

Page({
  data: {
    story_id: '',
    page_id: '0',
    textdata: "put value",
    isLastPage: false,
    imageVideofileType:0,
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

    //load data
    this.loadData();
    
    // save start
    try {
      var stories = wx.getStorageSync('stories');
      if (stories) {
        // add key to old stories obj
        var current_url = '/pages/story/story?story_id=' + story_id + '&page_id=' + page_id
        var story = Object.assign({},stories[story_id]);
        story['current_url'] = current_url;
        stories[story_id] = story;
        wx.setStorageSync('stories', stories);
      }else{
        //create new stories obj
        console.log("bug");
      }
    } catch (e) {
      // Do something when catch error
      console.log(e);
    }
   
    // save end
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('audioPlayer')
  },
  buttonClicked: function (e) {
    var nextPageId = e.currentTarget.dataset.nextpageid  //this.data.textdata.links[0].nextPageId
    var url = '/pages/story/story?story_id=' + this.data.story_id + '&page_id=' + nextPageId
      wx.redirectTo({
        url: url
      })
  },

  checkIfLastPage() {
    var length = this.data.textdata.links.filter(function (link) {
      return link.dst_page_id != null;
    }).length
    return length == f0;
  },
  checkFileType(){
    //0 for null
    //1 for image
    // 2 for video
    // 3 for sounds
    // 4 for others
    if (this.data.textdata.image_video_url == null) {
      return 0;
    }
    var arr = this.data.textdata.image_video_url.split('.');
    var fileExtension = arr[arr.length-1];
    var isImage = ['jpg', 'png', 'jpeg'].includes(fileExtension.toLowerCase());
    if(isImage){
      return 1;
    }
    var isVideo = ['mov', 'mp4'].includes(fileExtension.toLowerCase());
    if(isVideo){
      return 2;
    }

    var isSound = ['mp3', 'wav'].includes(fileExtension.toLowerCase());
    if (isSound) {
      return 3;
    }
    return 4;
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
  },
  loadData(){
    //send request and grab current page data
    var that = this;
    var url = host + '/api/v1/stories/' + this.data.story_id + '/pages/' + this.data.page_id;
    wx.request({
      url: url,
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data);
        that.setData({ textdata: res.data });
        that.setData({
          isLastPage: that.checkIfLastPage(),
          imageVideofileType: that.checkFileType()
        });
        wx.stopPullDownRefresh();
        wx.hideLoading();
      },
      fail: function (res) {
      },
    });
  },
  onPullDownRefresh(){
    wx.showLoading({
      title: '加载中',
    });
    this.loadData();
  }
})