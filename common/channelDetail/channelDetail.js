// common/channelDetail/channelDetail.js
const request = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    dividerList: [
      {id: 1, title: '动态'},
      {id: 2, title: '评论'},
      {id: 3, title: '成员'}
    ],
    chooseId: 1,
    channelInfo: {},
    channelList: [],
    commentList: [],
    adminList: [],
    page: 1,
    hasMore: true,
    floorstatus: false
  },
  getChannelInfo(id) {
    request({
      url: 'https://www.missevan.com/mobileWeb/getChannel?channelid='+id,
      success: (res) => {
        this.setData({
          channelInfo:res.info.channel
        })
      }
    })
  },
  getChannelList(id) {
    request({
      url: 'https://www.missevan.com/mobileWeb/getchanneldetail?&order=3&channel_id='+id,
      success: (res) => {
        this.setData({
          channelList:res.info.Datas
        })
      }
    })
  },
  changeId(e) {
    let id  = e.currentTarget.dataset.id;
    this.setData({
      chooseId: id
    })
  },
  getCommentData(page, id){
    request({
      url: 'https://www.missevan.com/site/getcomment?&order=3&type=4&p='+page+'&eId='+id,
      method: 'POST',
      success: (res) => {
        this.setData({
          commentList: [...this.data.commentList, ...res.successVal.comment.Datas],
          hasMore: res.successVal.comment.pagination.hasMore
        })
      }
    })
  },
  getAdmin(id){
    request({
      url: 'https://www.missevan.com/mobileWeb/channeladmin?channel_id='+id,
      success: (res) => {
        this.setData({
          adminList: res.info
        })
      }
    })
  },
  toSoundPage(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../common/sound/sound'+'?id='+id
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
    this.setData({
      id: options.id
    })
    this.getChannelInfo(options.id);
    this.getChannelList(options.id);
    this.getCommentData(this.data.page,options.id);
    this.getAdmin(options.id);
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
    if(this.data.hasMore&&this.data.chooseId===2) {
      let page = this.data.page++;
      this.getCommentData(page, this.data.id);
    } 
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})