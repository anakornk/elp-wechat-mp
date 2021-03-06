var host = getApp().globalData.host

Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '来看看大象的故事!',
      imageUrl: this.data.host + '/images/elp_logo.png',
      path: '/pages/stories/stories',
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
    scrollTop: 0,
    host
  },
  onLoad: function () {
    this.pulledDown = 0;
    this.backToZero = 1;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    var count = 0;
    var timerId = setInterval(function(){
      if(count > 200){
        console.log("timeout");
        clearInterval(that.timerId);
      }
      try{
        var third_session = wx.getStorageSync('3rd_session')
        if(third_session != ""){
          that.loadData(third_session);
          clearInterval(that.timerId);
          console.log("out");
        }else{
          count++;
          console.log(count);
        }
      }catch(e){
        console.log("data error");
      }
    },500)

    this.timerId = timerId;
  },
  onShow(){

    try {
      var stories = wx.getStorageSync('stories');
      if (stories) {
        this.setData({ storage_stories: stories })
      }else {
        this.setData({storage_stories:{}})
      }
    }catch(e){
      console.log("pull stories data from storage error");
    }

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
    var arrayIndex = e.target.dataset.index;
    var story_id = this.data.textdata[arrayIndex].id;
    var root_page_id = this.data.textdata[arrayIndex].root_page_id;
    var title = this.data.textdata[arrayIndex].title;
    var img_url = this.data.textdata[arrayIndex].image_url;
    
    try {
      var stories = wx.getStorageSync('stories');

      if (stories) {
        // add key to old stories obj
        var url = "";
        if(stories[story_id]){
          var story = Object.assign({},stories[story_id]);
          story['title']=title;
          story['img_url']=img_url;
          url = story.current_url;
          stories[story_id] = story;
        }else{
          url = '../story/story?story_id=' + story_id + '&page_id=' + root_page_id;
          stories[story_id] = { title: title, img_url: img_url };
        }
        wx.setStorageSync('stories', stories);
        wx.navigateTo({
          url: url
        })
      } else {
        //create new stories obj
        stories = {};
        stories[story_id] = {title: title,img_url:img_url};
        wx.setStorageSync('stories', stories);
        url = '../story/story?story_id=' + story_id + '&page_id=' + root_page_id;
        wx.navigateTo({
          url: url
        });
      }
      console.log("stored");
    } catch (e) {
      // Do something when catch error
      console.log(e);
    }

    // var url = '../story/story?story_id=' + story_id + '&page_id=' + root_page_id
    
  },
  loadData(third_session) {
    console.log("load data");
    var that = this;
    wx.request({
      url: host + '/api/v1/stories',
      method: 'GET',
      header: { 'content-type': 'application/json' },
      data: { third_session: third_session },
      success: function (res) {
        console.log("load success");
        if(res.data.error != undefined){
          console.log("error");
        }else {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].isNew = (new Date() - new Date(res.data[i].updated_at)) / (1000 * 60 * 60 * 24) < 3
          }
          that.setData({ textdata: res.data });
        }
        
        wx.stopPullDownRefresh();
        wx.hideLoading();
        that.setData({ pulledDown: false })
        that.pulledDown = 0;
      },
      fail: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        that.setData({ pulledDown: false })
        that.pulledDown = 0;
      },
    });

  },
  onPullDownRefresh: function () {
    console.log("pulldown")
    wx.showLoading({
      title: '加载中',
    });
    try{
      var third_session = wx.getStorageSync('3rd_session')
      if(third_session != ""){
        this.loadData(third_session);
      }else{
        wx.stopPullDownRefresh();
        wx.hideLoading();
      }
    }catch(e){
      console.log(e);
    } 
  },
  likeStory(e){
    var that = this;
    try{
      var story_id = e.currentTarget.dataset.storyid
      var third_session = wx.getStorageSync('3rd_session');
      // console.log("likestory")
      // console.log(third_session)
      wx.request({
        url: host + '/api/v1/stories/'+ story_id + '/like',
        header: { 'content-type': 'application/json' },
        method: 'POST',
        data: { third_session: third_session },
        success: function (res) {
          // console.log("like story success")
          // that.setData({ textdata: res.data });
          //wx.stopPullDownRefresh();
          //wx.hideLoading();
          //  console.log(res.data);
          if(res.data.error == undefined){
            var textdata = Object.assign([], that.data.textdata);
            var index = textdata.findIndex(function (element) {
              return element.id == story_id;
            });
            textdata[index].likes_count = res.data.likes_count;
            textdata[index].liked = res.data.liked;
            that.setData({ textdata: textdata })
            // console.log(textdata.length);
            // console.log(that.data)
          }else{
            console.log(res.data.error)
          }
         
        },
        fail: function (res) {
          console.log("like failed")
        },
      });
    }catch(e){
      console.log("like story break catch")
    }
    
  },
  upper(e){
    console.log("upper")
    // console.log("upper")
    // wx.showLoading({
    //   title: '加载中',
    // });
    // this.loadData();
  },scroll(e){
    // console.log(e.detail.scrollTop);
    // console.log(this.data.pulledDown);
    var pulledDown = (this.pulledDown == 0);
    var isBelow = e.detail.scrollTop < -50;
    var  backToZero = this.backToZero == 1;
    // console.log("---");
    // console.log(pulledDown);
    // console.log(isBelow);
    // console.log("---");
    if(e.detail.scrollTop >= 0 ){
      this.backToZero = 1;
    }
    if(pulledDown && isBelow && backToZero){
      console.log("puleld down")
      // this.setData({ pulledDown: true })
      this.pulledDown = 1;
      this.backToZero = 0;
      wx.showLoading({
        title: '加载中',
      });
      try {
        var third_session = wx.getStorageSync('3rd_session')
        if (third_session != "") {
          this.loadData(third_session);
        } else {
          console.log("third_session blank")
          wx.stopPullDownRefresh();
          wx.hideLoading();
        }
      } catch (e) {
        console.log("tata error");
      } 
    }
  },
  scroll2: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  }, refresh2: function (event) {
    this.setData({
      scrollTop: 0
    });
    console.log("resfresh");
  }
  
})