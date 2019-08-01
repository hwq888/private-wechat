// miniprogram/pages/views/release/release.js
const db = wx.cloud.database();
const app = getApp()
var Utils = require('../../../js/Utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    bindType: '', // 1: 日记 2:备忘录
    title: '',
    content: '',
    time: ''
  },
  bindKeyInput: function (e) {
    console.log(e)
    const _type = e.target.dataset.type
    if (_type === 'title') {
      this.setData({
        title: e.detail
      })
    }
    if (_type === 'content') {
      this.setData({
        content: e.detail
      })
    }
    
  },
  // 确定
  submit: function () {
    if (this.data.title.length < 1) {
      wx.showToast({
        title: '标题至少需要2个文字以上',
        icon: 'none'
      })
      return
    }
    if (this.data.content.length < 10) {
      wx.showToast({
        title: '内容至少需要10个文字以上',
        icon: 'none'
      })
      return
    }
    this.setData({ loading: true })
    db.collection('diary').add({
      data: {
        title: this.data.title,
        content: this.data.content,
        time: Utils.formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss')
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '发布成功',
          icon: 'success'
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
          loading: false
        })
      }
    })
  },
  // 更新
  updata: function () {
    // db.collection('passWord').doc('face13585d3ea136058fbc8265014e26').update({
    //   data: {
    //     pwa: '654321'
    //   },
    //   success: res => {
    //     console.log(res)
    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })
  },
  // 查询
  search: function () {
    // db.collection('passWord').where({
    //   _openid: 'o_ct45Bc33-ZwG0Z7aRz-K4pw22Y'
    // }).get().then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // })
  },
  // 单条数据删除， 多条数据删除需要用到云函数
  delete: function () {
    db.collection('diary').doc('26b301645d3fb1160628ccbd454acdc5').remove()
      .then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bindType: options.type
    })
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