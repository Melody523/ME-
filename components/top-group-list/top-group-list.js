// components/top-group-list/top-group-list.js
const request = require('../../utils/request');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    info: {},
    datas: []
  },
  
  ready() {
    this.getInfoData();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getInfoData() {
      request({ url: 'https://www.missevan.com/mobileWeb/newHomepage3', success: (res) => {
        this.setData({
          info: res.info
        })
      }})
      request({ url: 'https://www.missevan.com/sound/newhomepagedata', success: (res) => {
        this.setData({
          datas: res.music
        })
      }})
    }
  }
})
