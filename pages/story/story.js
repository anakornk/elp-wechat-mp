var host = getApp().globalData.host

Page({
  data: {
    story_id: '',
    page_id: '0',
    textdata: "put value",
    isLastPage: false,
    imageVideofileType:0,
    root_page_id: undefined,
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
        wx.setNavigationBarTitle({
          title: stories[story_id].title
        })
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
    var nextPageId = e.currentTarget.dataset.nextpageid;  //this.data.textdata.links[0].nextPageId
    var url = '/pages/story/story?story_id=' + this.data.story_id + '&page_id=' + nextPageId;
    wx.redirectTo({
      url: url
    });
  },

  checkIfLastPage() {
    //if error return true
    if(this.data.textdata.error){
      return true;
    }
    var length = this.data.textdata.links.filter(function (link) {
      return link.dst_page_id != null;
    }).length
    return length == 0;
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
    var path = '/pages/story/story?story_id=' + this.data.story_id + '&page_id=' + this.data.page_id;
    var imgUrl = ''
    if (this.data.imageVideofileType == 1) {
      console.log("img url");
      imgUrl = this.data.host + this.data.textdata.image_video_url
    }

    if (res.from === 'button') {
      path = '/pages/story/story?story_id=' + this.data.story_id + '&page_id=' + this.data.root_page_id;
      imgUrl = this.data.host + this.data.root_page_imgUrl;
    }
   
    return {
      title: 'Send to friends!',
      path: path,
      imageUrl: imgUrl,
      success: function (res) {
      //  console.log("shared");
      },
      fail: function (res) {
        // console.log("not shared");
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

        if(res.data.error != undefined){
          try {
            var stories = wx.getStorageSync('stories');
            if (stories) {
              var story_id = that.data.story_id;
              delete stories[story_id];
              wx.setStorageSync('stories', stories);
            }
          } catch (e) {
            // Do something when catch error
            console.log(e);
          }
        }else{
          var isLastPage = that.checkIfLastPage()
          that.setData({
            isLastPage: isLastPage,
            imageVideofileType: that.checkFileType()
          });
          if(isLastPage){
            wx.request({
              url: host + '/api/v1/stories/' + that.data.story_id,
              success: function (res) {
                console.log(res.data);
                if (res.data.error != undefined) {
                  //error
                  console.log("login error");
                } else {
                  //success
                  that.setData({
                    root_page_id: res.data.root_page_id,
                    root_page_imgUrl: res.data.image.url
                  });
                }

              }
            })
            try {
              var stories = wx.getStorageSync('stories');
              if (stories) {
                var story_id = that.data.story_id;
                // var story = Object.assign({},stories[story_id]);
                // story['completed'] = true;
                stories[story_id].completed = true;
                // delete stories[story_id];
                wx.setStorageSync('stories', stories);
              }
            } catch (e) {
              // Do something when catch error
              console.log(e);
            }
          }
        }

        wx.stopPullDownRefresh();
        wx.hideLoading();
      },
      fail: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading();
      },
    });
  },
  onPullDownRefresh(){
    wx.showLoading({
      title: '加载中',
    });
    this.loadData();
  },
  endButtonClicked(){
    console.log("redirect")
    var url = '/pages/user/user'
    wx.switchTab({
      url: url
    })
  }
})