// common/channel/channel.js
const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [
      {id: 0, title: '全部'},
      {id: 1, title: 'M音'},
      {id: 2, title: '铃声'}
    ],
    chooseId: 0,
    channelList: [],
    floorstatus: false
  },
  changeType(e) {
    this.setData({
      chooseId: e.currentTarget.dataset.id
    })
    // console.log(this.chooseId)
    this.getChannelData(e.currentTarget.dataset.id);
  },
  getChannelData(id=0) {
    request({
      url: 'https://www.missevan.com/mobileWeb/channels?type='+id,
      success: (res) => {
        this.setData({
          channelList: res.info
        })
      }
    })
  },
  toChannelDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../common/channelDetail/channelDetail'+'?id='+id
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
    this.getChannelData();
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