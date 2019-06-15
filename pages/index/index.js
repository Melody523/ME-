//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    floorstatus: false
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
  onLoad: function () {
    
  }
  
})
