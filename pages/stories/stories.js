var host = getApp().globalData.host

Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: 'Send to friends!',
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
    host
  },
  onLoad: function () {

    var last_page = wx.getStorageSync('key')
    // if (last_page) {
    //   wx.navigateTo({
    //     url: last_page,
    //   })
    // }

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    this.loadData();
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
  loadData() {
    console.log("load data");
    var that = this;
    wx.request({
      url: host + '/api/v1/stories',
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        that.setData({ textdata: res.data });
        wx.stopPullDownRefresh();
        wx.hideLoading();
      },
      fail: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading();
      },
    });
  },
  onPullDownRefresh: function () {
    console.log("pulldown")
    wx.showLoading({
      title: '加载中',
    });
    this.loadData();
  },
})