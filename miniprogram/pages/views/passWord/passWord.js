// miniprogram/pages/views/passWord.js
const db = wx.cloud.database();
// 初始化数据库
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false, // 按钮是否可用
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    p1f: true,
    p2f: false,
    p3f: false,
    p4f: false,
    p5f: false,
    p6f: false,
  },
  bindKeyInput: function (e) {
    // console.log(e)
    // console.log(e.detail.keyCode)
    // wx.showToast({
    //   title: e.detail.keyCode,
    //   icon: 'success',
    //   duration: 2000
    // })
    const _id = e.target.dataset.id
    // keyCode=8 代表删除
    const _keyCode = e.detail.keyCode
    if (_id === 'p1') {
      if (_keyCode === 8) {
        this.setData({
          p1: e.detail.value
        })
      } else {
        this.setData({
          p1: e.detail.value,
          // p1f: false,
          p2f: true
        })
      }
    }
    if (_id === 'p2') {
      if (_keyCode === 8) {
        this.setData({
          p2: e.detail.value,
          // p2f: false,
          p1f: true
        })
      } else {
        this.setData({
          p2: e.detail.value,
          // p2f: false,
          p3f: true
        })
      }
    }
    if (_id === 'p3') {
      if (_keyCode === 8) {
        this.setData({
          p3: e.detail.value,
          // p3f: false,
          p2f: true
        })
      } else {
        this.setData({
          p3: e.detail.value,
          // p3f: false,
          p4f: true
        })
      }
    }
    if (_id === 'p4') {
      if (_keyCode === 8) {
        this.setData({
          p4: e.detail.value,
          // p4f: false,
          p3f: true
        })
      } else {
        this.setData({
          p4: e.detail.value,
          // p4f: false,
          p5f: true
        })
      }
    }
    if (_id === 'p5') {
      if (_keyCode === 8) {
        this.setData({
          p5: e.detail.value,
          // p5f: false,
          p4f: true
        })
      } else {
        this.setData({
          p5: e.detail.value,
          // p5f: false,
          p6f: true
        })
      }
    }
    if (_id === 'p6') {
      if (_keyCode === 8) {
        this.setData({
          p6: e.detail.value,
          // p6f: false,
          p5f: true
        })
      } else {
        this.setData({
          p6: e.detail.value
        })
      }
    }
  },
  // 确定
  submit: function () {
    // console.log('sumbit')
    this.setData({loading: true})
    // 查询当前用户是否已设置私密密码
    db.collection('passWord').where({ _openid: app.globalData.openid}).get().then(res => {
      console.log(res)
      if (res.data.length > 0) {
        wx.showToast({
          title: '您已设置私密密码，不需重新设置！',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          loading: false
        })
      } else {
        // 新增私密密码
        const _pwa = this.data.p1 + this.data.p2 + this.data.p3 + this.data.p4 + this.data.p5 + this.data.p6
        if (_pwa.length === 6) {
          db.collection('passWord').add({
            data: {
              pwa: _pwa
            },
            success: res => {
              console.log(res)
              wx.showToast({
                title: '私密密码设置成功',
                icon: 'none',
                duration: 2000
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)
            },
            fail: err => {
              console.log(err)
              this.setData({
                loading: false,
                p1: '',
                p2: '',
                p3: '',
                p4: '',
                p5: '',
                p6: ''
              })
            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '请输入6位密码',
          })
        }
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 更新
  updata: function () {
    db.collection('passWord').doc('face13585d3ea136058fbc8265014e26').update({
      data: {
        pwa: '654321'
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  // 查询
  search: function () {
    db.collection('passWord').where({
      _openid: 'o_ct45Bc33-ZwG0Z7aRz-K4pw22Y'
    }).get().then(res=>{
      console.log(res)
    }).catch(err=>{
      console.log(err)
    })
  },
  // 单条数据删除， 多条数据删除需要用到云函数
  delete: function () {
    db.collection('passWord').doc('890198e15d3eb49c059e8c1f05ed72b9').remove()
    .then(res=>{
      console.log(res)
    }).catch(err=>{
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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