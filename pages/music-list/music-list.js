// pages/music-list/music-list.js
const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musics: [],
    floorstatus: false,
    type_1: [],
    type_2: [],
    type_3: [],
    chooseId: 0,
    animationData: {},
    width: 0,
    showNav: false
  },
  getMusics(id) {
    let url = id==0?'https://www.missevan.com/explore/tagalbum?order=0':'https://www.missevan.com/explore/tagalbum?order=0&tid='+id
    request({
      url: url,
      success: (res)=>{
        this.setData({
          musics: res.albums
        })
      }
    })
  },
  getRecommand() {
    request({
      url: 'https://www.missevan.com/malbum/recommand',
      success: (res)=>{
        this.setData({
          type_1: res.info.情感,
          type_2: res.info.场景,
          type_3: res.info.主题
        })
      }
    })
  },
  toAlbum(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../common/album/album?id='+id
    })
  },
  onPageScroll(e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  changeId(e) {
    let id  = e.currentTarget.dataset.id;
    
    this.setData({
      chooseId: id
    })
    this.getMusics(id);
    this.animation.translate(this.data.width*0.9, 0).step({ duration: 500 })
    this.setData({
      animationData: this.animation.export(),
      showNav: false
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMusics(this.data.chooseId);
    this.getRecommand();
    this.getWidth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })

    this.animation = animation
  },
  getWidth() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          width: res.windowWidth
        })
      }
    })
  },
  translate: function () {
    this.animation.translate(0, 0).step({ duration: 500 })
    this.setData({
      animationData: this.animation.export(),
      showNav: true
    })
  },
  cancel() {
    this.animation.translate(this.data.width*0.9, 0).step({ duration: 500 })
    this.setData({
      animationData: this.animation.export(),
      showNav: false
    })
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

  }
})