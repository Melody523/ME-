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
        url: url, //仅为示例，并非真实的接口地址
        dataType: 'json',
        method: method,
        header: {
            'content-type': 'application/json' // 默认值
        },
        success(res) {
            if (res.data.status === 'fail') {
                wx.showToast({
                    title: '数据请求失败,请稍后重试...',
                    image: '../images/icons/fail.png',
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
                image: '../images/icons/fail.png',
                duration: 2000
            })
            toast = false;
            fail(error)
        },
        complete() {
            if (toast) {
                wx.hideToast();
            } 
        }
    })
}

module.exports = request;