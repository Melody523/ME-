// components/children/catalog/catalog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    catalogsList:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toSoundPage(e){
      let id  = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../common/sound/sound?id='+id
      })
    }
  }
})
