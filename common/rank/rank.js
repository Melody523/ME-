// common/rank/rank.js
const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: [],
    floorstatus: false
  },
  getRank() {
    request({
      url: 'https://www.missevan.com/mobileWeb/albumList',
      success: (res) => {
        this.setData({
          rankList: res.info
        })
      }
    })
  },
  toAlbumList(e) {
    let id  = e.currentTarget.dataset.id;
    let url = '../album/album?id=' + id;
    wx.navigateTo({
      url: url
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRank()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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