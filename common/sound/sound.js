// common/sound/sound.js
const sounds = require('../../utils/sounds');
const request = require('../../utils/request');
function getRandomColor () {
  let rgb = []
  for (let i = 0 ; i < 3; ++i){
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}


Page({

  /**
   * 页面的初始数据
   */
  inputValue: '',
  data: {
    controlList: [],
    dividerList: [
      {id: 1, title: '简介'},
      {id: 2, title: '评论'},
      {id: 3, title: '图片'}
    ],
    soundInfo: {},
    dramaInfo: {},
    hasdramaInfo: false,
    userInfo: {},
    cvInfo: [],
    hascvInfo: false,
    dramasList: [],
    hasdramasList: false,
    soundsList: [],
    showNum: 4,
    isShow: false,
    play: false,
    danmuList: [],
    floorstatus: false,
    chooseId: 1,
    commentList: [],
    hasMore: true,
    page:1,
    id: 0,
    imageList: []
  },
  // changeValue(e) {
  //   console.log('slider' + 'index' + '发生 change 事件，携带值为', e.detail.value)
  // },
  changeShowNum() {
    if (!this.data.isShow) {
      this.setData({
        showNum: 99,
        isShow: true
      })
    } else {
      this.setData({
        showNum: 4,
        isShow: false
      })
    }
  },
  
  bindInputBlur: function(e) {
    this.inputValue = e.detail.value
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  getSound(id) {
    request({
      url: 'https://www.missevan.com/sound/getsound?soundid='+id,
      success: (res)=> {
        this.setData({
          soundInfo: res.info.sound,
          userInfo: res.info.user
        })
      }
    })
    request({
      url: 'https://www.missevan.com/dramaapi/getdramabysound?sound_id='+id,
      success: (res)=> {
        this.setData({
          dramaInfo: res.info.drama,
          cvInfo: res.info.cvs,
          hasdramaInfo: res.info.drama===undefined ? false: true,
          hascvInfo: res.info.cvs===undefined|| res.info.cvs.length===0? false: true
        })
      }
    })
    request({
      url: 'https://www.missevan.com/sound/getsoundlike?type=15&sound_id='+id,
      success: (res)=> {
        this.setData({
          dramasList: res.info.dramas,
          hasdramasList: res.info.dramas.length===0 ? false: true,
          soundsList: res.info.sounds
        })
      }
    })
  },
  getCommentData(page, id){
    request({
      url: 'https://www.missevan.com/site/getcomment?&order=3&type=1&p='+page+'&eId='+id,
      method: 'POST',
      success: (res) => {
        this.setData({
          commentList: [...this.data.commentList, ...res.successVal.comment.Datas],
          hasMore: res.successVal.comment.pagination.hasMore
        })
      }
    })
  },
  getImage(id) {
    request({
      url: 'https://www.missevan.com/sound/getSortedImage?soundid='+id,
      success: (res) => {
        this.setData({
          imageList: res.info || []
        })
      }
    })
  },
  toDramaPage(e) {
    let id  = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../drama/drama?id='+id
    })
  },
  toSoundPage(e){
    let id  = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../sound/sound?id='+id
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
  changePlay(e){
    this.setData({
      play: !this.data.play
    })
    if(this.data.soundInfo.videourl==''){
      // console.log(this.data.play)
      this.innerAudioContext.autoplay = true
      this.innerAudioContext.src = 'https://static.missevan.com/'+ e.currentTarget.dataset.url
      if(!this.data.play){
        this.innerAudioContext.pause(() => {
          // console.log('暂停')
        })
      } else{
        this.innerAudioContext.play(() => {
          // console.log('开始')
        })
        this.innerAudioContext.onPlay(() => {
          // console.log('开始播放')
        })
      }
      
      // this.innerAudioContext.onError((res) => {
      //   console.log(res.errMsg)
      //   console.log(res.errCode)
      // })
    }
  },
  changeId(e){
    let id  = e.currentTarget.dataset.id;
    this.setData({
      chooseId: id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      controlList: sounds,
      id: options.id
    })
    this.getSound(options.id);
    this.getCommentData(this.data.page, options.id);
    this.getImage(options.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo');
    this.innerAudioContext = wx.createInnerAudioContext()
    
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
    this.innerAudioContext.destroy();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.innerAudioContext.destroy();
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