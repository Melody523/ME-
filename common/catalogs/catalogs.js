// common/catalogs/catalogs.js
const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catalogsTitle: '',
    catalogsList: [],
    catalogsSon: [],
    catalogsNav:　[],
    chooseId: -1,
    toView: 'index-1',
    setHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getCatalogsList(id) {
    request({
      url: 'https://www.missevan.com/mobileWeb/catalogrank?cid='+id,
      success: (res) => {
        this.setData({
          catalogsList: res.info
        })
      }
    })
  },
  getAllCatalogs(id) {
    request({
      url: 'https://www.missevan.com/mobileWeb/catalogs',
      success: (res) => {
        let sonObj = res.info[id].son;
        let catalogsArr = [];
        let nav = [];
        for (const key in sonObj) {
          nav.push({id: sonObj[key].id, catalog_name: sonObj[key].catalog_name})
          request({
            url: 'https://www.missevan.com/mobileWeb/catalogmenu?order=3&cid='+sonObj[key].id+'&page_size=4',
            success: (res) => {
              catalogsArr.push({id: sonObj[key].id,nav:'index'+sonObj[key].id, catalog_name: sonObj[key].catalog_name, catalogsSonList: res.info.Datas})
            }
          })
        }
        this.setData({
          catalogsNav: nav
        })
        setTimeout(() => {
          this.setData({
            catalogsSon: catalogsArr
          })
        }, 1200);
      }
    })
  },
  changeId(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      chooseId: id,
      toView: 'index'+id
    })
  },
  getHeight() {
    wx.getSystemInfo({
      success:(res)=>{
        this.setData({
          setHeight: res.windowHeight*2-154
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      catalogsTitle: options.title
    })
    this.getCatalogsList(options.id);
    this.getAllCatalogs(options.id);
    this.getHeight();
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