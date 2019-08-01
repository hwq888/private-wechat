//index.js
const db = wx.cloud.database();
// 初始化数据库
const app = getApp()
Page({
  data: {
    linkUrl: '',
    show: true,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    alertData: {},
    passWordData: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    // console.log('首页：onLoad')
    // this.setData({
    //   alertData: {
    //     show: true,
    //     cancelBtn: true,
    //     cancelBtnText: '取消',
    //     confirmButtonText: '立即设置',
    //     message: '您还没有设置私密密码，立即设置？'
    //   }
    // })
    // 新增全局参数passpwa 用于判断是否通过密码验证
    app.globalData.passpwa = false
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              // 获取用户openid
              this.onGetOpenid()
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取用户私密密码
    this.userPassWord()
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // 获取用户私密密码
        this.userPassWord()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
  },
  // 判断用户是否配置密码
  userPassWord: function () {
    console.log('获取用户是否配置私密密码')
    db.collection('passWord').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      console.log(res)
      if (res.data.length>0) {
        app.globalData.pwa = res.data[0].pwa
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onLink: function (e) {
    this.setData({
      linkUrl: e.target.dataset.url
    })
    // 判断用户是否设置密码
    if (!app.globalData.pwa) {
      this.setData({
        alertData: {
          show: true,
          cancelBtn: true,
          cancelBtnText: '取消',
          confirmButtonText: '立即设置',
          message: '您还没有设置私密密码，立即设置？'
        }
      })
    } else if (!app.globalData.passpwa) { // 判断用户是否通过密码验证
      this.setData({
        passWordData: {
          show: true
        }
      })
    } else {
      
      wx.navigateTo({
        url: this.data.linkUrl
      })
    }
  },
  // 未设置密码-引导用户设置密码回调
  alertCallBack(event) {
    console.log("组件回调成功")
    // console.log(event.detail);
    wx.navigateTo({
      url: '../passWord/passWord'
    })
  },
  // 已设置密码-验证密码弹窗-回调
  passWordCallBack (falg) {
    app.globalData.passpwa = falg.detail
    if (app.globalData.passpwa) {
      wx.navigateTo({
        url: this.data.linkUrl
      })
    }
  }
})
