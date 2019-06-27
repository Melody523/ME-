# ME小程序开发
## 项目技术点总结
1. 实现返回顶部主要利用`onpageScroll`监测屏幕的位置，`e.scrollTop`监听页面在垂直方向已滚动的距离来判断返回顶部按钮是否显示;
```
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
}
```
```
goTop() { 
    if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
    } else {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
}
```

2. 与服务端进行数据交互生命周期函数`onLoad`--监听页面加载;对`request`进行封装
```
const request = ({
    url,
    success,
    fail,
    method='GET',
    toast = true
}) => {
    if (toast) {
        wx.showToast({
            title: '加载中...',
            icon: 'loading'
        })
    }
    wx.request({
        url: url, 
        dataType: 'json',
        method: method,
        header: {
            'content-type': 'application/json' // 默认值
        },
        success(res) {
            if (res.data.status === 'fail') {
                wx.showToast({
                    title: '数据请求失败,请稍后重试...',
                    duration: 2000
                });
                toast = false;
            } else {
                success(res.data);
            }
        },
        fail(error) {
            wx.showToast({
                title: '数据请求失败,请稍后重试...',
                duration: 2000
            })
            toast = false;
            fail(error);
        },
        complete() {
            if (toast) {
                wx.hideToast();
            } 
        }
    })
}

module.exports = request;
```

3. vscode中可安装插件`Easy WXLESS`来自动将`less`转换成`wxss`文件

4. 可利用`wxs`模块实现过滤效果，例如将数值取整，规范化日期等，用法如下：
可以编写在 `wxml` 文件中的 `<wxs>` 标签内，或以 `.wxs` 为后缀名的文件内;
```
  var filter = {
  numberToFix: function (value) {
    return value.toFixed(1)
  },
  numToDate: function(value) {
    var date = getDate(parseInt(value)*1000);//其中getDate是相当于new Date()
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    return year + '/' + month + '/' + day + ' '+ h + ':' + m
  }
}
module.exports = {
  numberToFix: filter.numberToFix,
  numToDate: filter.numToDate
}
```
引入:
```
  <wxs module="filter" src="../../utils/numbertofix.wxs"></wxs>
```
使用:
```
 {{filter.numToDate(soundInfo.create_time)}}
```
5. 绑定事件和传值：`bindtap`绑定对应事件名，`data-id`和`data-type`传入对应的值
```
 bindtap="toCatalogPage" data-id="{{item.id}}" data-type="{{item.title}}"
```
js文件中对函数`toCatalogPage`传入形参e，通过`e.currentTarget.dataset.id`和`e.currentTarget.dataset.type`获取对应传入的值
  
6. API动画使用，`wxml`文件中对需要添加动画效果的最外层标签添加`animation="{{animationData}}"`，
js文件：生命周期函数`onShow` --监听页面显示时创建动画实例
```
this.animation = wx.createAnimation({
  duration: 500,
  timingFunction: 'ease',
})
```
点击标签显示时动画设置：
```
this.animation.translate(0, 0).step({ duration: 500 });
this.setData({
  animationData: this.animation.export(),
  showNav: true
})
```
点击遮罩层或取消按钮时隐藏动画设置：
```
this.animation.translate(this.data.width*0.9, 0).step({ duration: 500 });
this.setData({
  animationData: this.animation.export(),
  showNav: false
})
```

7. 导航栏根据手机屏幕动态设置宽度：
```
wx.getSystemInfo({
      success: (res) => {
        this.setData({
          width: res.windowWidth
        })
      }
    })
```

8. 跳转设置：
* < navigator>组件设置属性url跳转路径
* api跳转：
```
wx.navigateTo({
  url: '../../common/sound/sound?id='+id
})
```

9. 导航栏显示时禁止页面滑动在对应最外层标签设置
`catchtouchmove="ture"`

10. 组件scroll-view用法：
* 水平方向：`style="white-space: nowrap; width: 100%;"`不可省略
* 并且需要设置子元素例`nav-item`样式`display: inline-block;`
```
<scroll-view class="catalogs-nav" scroll-x="true" style="white-space: nowrap; width: 100%;">
    <view class="{{chooseId==-1? 'nav-item active':'nav-item'}}" bindtap="changeId" data-id="-1">
        全部动态
    </view>
    <block wx:for="{{catalogsNav}}" wx:key="{{item.id}}">
        <view class="{{chooseId===item.id? 'nav-item active':'nav-item'}}" bindtap="changeId" data-id="{{item.id}}">
            {{item.catalog_name}}
        </view>
    </block>
</scroll-view>
```
* 垂直方向：`scroll-into-view`是根据传入的值跳转到对应id值的标签；`scroll-y="true"`需要设置高度
获取屏幕高度：
```
wx.getSystemInfo({
  success:(res)=>{
    this.setData({
      setHeight: res.windowHeight*2-154
    })
  }
})
```
* `scroll-view`组件设置：
```
<scroll-view scroll-y="true" style="{{'height:'+setHeight+'rpx;'}}" scroll-into-view="{{toView}}">
    <catalog catalogsList="{{catalogsList}}" id="index-1"></catalog>
    <block wx:for="{{catalogsSon}}" wx:key="{{item.id}}">
        <catalog catalogsList="{{item}}" id="{{item.nav}}"></catalog>
    </block>
    <footer></footer>
</scroll-view>
```

11. 评论区域上拉加载：利用页面上拉触底事件的处理函数`onReachBottom`，由于页面中可点击切换简介、评论、图片区域；因此需要判断目前的区域是否是评论区并且是否还有数据可以请求；
```
conReachBottom: function () {
  if(this.data.hasMore&&this.data.chooseId===2) {
    let page = this.data.page++;
    this.getCommentData(page, this.data.id);
  } 
}
```

12. 动态设置内联样式:
`style="background-image: url({{'https://static.missevan.com/dramacoversmini/'+dramaInfo.cover}})"`

13. video组件播放视频和audio音频播放
* video组件设置：
```
<view class="sound-header">
    <image src="{{soundInfo.front_cover}}" wx:if="{{!play||soundInfo.videourl==''}}"/>
    <video autoplay="true" show-mute-btn="true" enable-play-gesture="true" id="myVideo" wx:if="{{play&&soundInfo.videourl!=''}}" src="{{soundInfo.videourl}}" danmu-list="{{danmuList}}" enable-danmu danmu-btn controls></video>
    <view class="play" wx:if="{{!play||soundInfo.videourl==''}}">
        <view class="{{play?'onplay':'play-icon'}}" bindtap="changePlay" data-url="{{soundInfo.soundurl_64}}">
        </view>
    </view>
</view>
```
* 弹幕设置：
```
function getRandomColor () {
  let rgb = []
  for (let i = 0 ; i < 3; ++i){
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
```
```
bindInputBlur: function(e) {
  this.inputValue = e.detail.value
},
bindSendDanmu: function () {
  this.videoContext.sendDanmu({
    text: this.inputValue,
    color: getRandomColor()
  })
}
```
* audio音频设置：
```
this.innerAudioContext = wx.createInnerAudioContext() //创建音频实例
```
```
changePlay(e){
  this.setData({
    play: !this.data.play
  })
  if(this.data.soundInfo.videourl==''){
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
  }
}
```

## 效果图预览
* 主页面
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/index.jpg" width="200">

* 音单列表，点击类型会侧滑出导航栏，可选择对应的类型
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/music-list.jpg" width="200">

* 音单列表导航栏
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/music-list-classify.jpg" width="200">

* 音乐详情页，根据路径判断是否存在视频链接，否则播放音乐
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/sound-info.jpg" height="614" >

* 视频详情页，添加弹幕功能
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/video-info.jpg" width="200">

* 详情页评论，可上拉加载更多
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/sount-comment.jpg" height="614">

* 分类页
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/classify.jpg" width="200">

* 排行榜，点击对应排行榜可跳转音乐列表页
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/rank.jpg" width="200">

* 排行榜详情，点击音乐可跳转音乐详情页
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/rank-list.jpg" width="200">

* 频道页，点击tab可以获取不同类型的频道，点击频道进入频道列表页
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/channel.jpg" width="200">

* 频道列表页，点击具体项，跳转音乐详情页
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/channel-list.jpg" width="200">

* 主题细分，类型导航可左右滑动，点击可滚动到对应位置
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/catalogs.jpg" width="200">

* 剧集详情
<img src="https://github.com/Melody523/ME-/blob/master/images/%E6%95%88%E6%9E%9C%E5%9B%BE/drama.jpg" width="200">
