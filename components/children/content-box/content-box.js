// components/children/content-box/content-box.js
const panel = require('../../../utils/panel.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    datas: { 
      type: Array
    },
    datasType: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    panelType: panel
  },
  ready() {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toCatalogsPage(e) {
      let id = e.currentTarget.dataset.id;
      let title = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: panel[id].link+'?id='+id+'&title='+title
      })
    },
    toSoundPage(e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../common/sound/sound'+'?id='+id
      })
    }
  }
})
