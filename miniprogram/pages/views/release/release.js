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
    id: '', // 编辑id
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
    if (!this.data.title && this.data.bindType === 1) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      })
      return
    }
    if (!this.data.content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }
    this.setData({ loading: true })
    // 日记
    if (this.data.bindType === '1') {
      if (this.data.id) {
        // 编辑日记
        this.updataDiary(this.data.id)
      } else {
        // 新增日记
        this.addDiary();
      }
    } else if (this.data.bindType === '2') {
      // 便签
      if (this.data.id) {
        // 编辑便签
        this.updataMemorandum(this.data.id)
      } else {
        // 新增便签
        this.addMemorandum()
      }
    }
  },
  // 新增日记
  addDiary: function () {
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
  // 新增便签
  addMemorandum: function () {
    db.collection('memorandum').add({
      data: {
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
  // 更新日记
  updataDiary: function (id) {
    db.collection('diary').doc(id).update({
      data: {
        title: this.data.title,
        content: this.data.content
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '编辑成功',
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
      }
    })
  },
  // 更新便签
  updataMemorandum: function (id) {
    db.collection('memorandum').doc(id).update({
      data: {
        content: this.data.content
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '编辑成功',
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
      }
    })
  },
  // 查询日记
  getDiary: function (id) {
    db.collection('diary').where({
      _id: id
    }).get().then(res => {
      console.log(res)
      this.setData({
        title: res.data[0].title,
        content: res.data[0].content
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 查询便签
  getMemorandum: function (id) {
    db.collection('memorandum').where({
      _id: id
    }).get().then(res => {
      console.log(res)
      this.setData({
        content: res.data[0].content
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 单条数据删除， 多条数据删除需要用到云函数
  // delete: function () {
  //   db.collection('diary').doc('26b301645d3fb1160628ccbd454acdc5').remove()
  //     .then(res => {
  //       console.log(res)
  //     }).catch(err => {
  //       console.log(err)
  //     })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bindType: options.type
    })
    // 编辑日记
    if (options.id) {
      this.setData({
        id: options.id
      })
      if (this.data.bindType === '1') {
        wx.setNavigationBarTitle({
          title: '编辑日记'
        })
        this.getDiary(this.data.id)
      }
      if (this.data.bindType === '2') {
        wx.setNavigationBarTitle({
          title: '编辑便签'
        })
        this.getMemorandum(this.data.id)
      }
    } else {
      if (this.data.bindType === '1') {
        wx.setNavigationBarTitle({
          title: '发布日记'
        })
      }
      if (this.data.bindType === '2') {
        wx.setNavigationBarTitle({
          title: '发布便签'
        })
      }
    }
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