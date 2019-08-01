// miniprogram/pages/views/diary/diary.js
const db = wx.cloud.database();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectId: "", // // 选中日记id
    touchStartTime: '',
    touchEndTime: '',
    showNoContent: false,
    totalCount: '', // 总数量
    pageSize: 10,  // 每页10条数据
    list: [],
    alertData: {}
  },
  // 获取列表总数
  getTotalCount: function () {
    db.collection('diary')
      .where({
        _openid: app.globalData.openid
      })
      .count()
      .then(res => {
        this.setData({
          totalCount: res.total
        })
    })
  },
  // 获取日记列表-初始化
  getDiaryList: function () {
    this.setData({
      list: []
    })
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('diary')
      .where({
        _openid: app.globalData.openid
      })
      .orderBy('time', 'desc') // 时间 降序
      // .skip(this.data.list.length) // 从指定序列后的结果开始返回，常用于分页
      .limit(this.data.pageSize) // 限制返回数量为 this.data.pageSize 条
      .get().then(res => {
        console.log(res)
        // debugger
        wx.hideLoading();//隐藏加载
        this.setData({
          list: this.data.list.concat(res.data)
        })
        if (res.data.length === 0 && this.data.list.length === this.data.totalCount) {
          wx.showToast({
            icon: 'none',
            title: '没有更多数据了',
          })
        }
        
        if (this.data.list === 0) {
          this.setData({
            showNoContent: true
          })
        }
      }).catch(err => {
        console.log(err)
      })
  },
  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  // 跳转到日记详情
  linkDetails: function (e) {
    console.log('linkDetails')
    console.log(e)
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (this.touchEndTime - this.touchStartTime < 350) {
      const _id = e.target.dataset.id
      wx.navigateTo({
        url: './details/details?id=' + _id
      })
    }
  },
  // 跳转到发布日记
  onLinkRelease: function () {
    wx.navigateTo({
      url: '../release/release?type=1'
      // events: {
      //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      //   acceptDataFromOpenedPage: function (data) {
      //     console.log(data)
      //   },
      //   someEvent: function (data) {
      //     console.log(data)
      //   }
      // }
    })
  },
  // 编辑日记
  onLinkEdit: function () {
    wx.navigateTo({
      url: `../release/release?type=1&id=${this.data.selectId}`
    })
  },
  // 删除日记
  onLinkDel: function () {
    this.setData({
      alertData: {
        show: true,
        cancelBtn: true,
        cancelBtnText: '取消',
        confirmButtonText: '删除',
        message: '您确定删除这篇日记？'
      }
    })
  },
  // 确认删除日记
  alertCallBack() {
    wx.showLoading({
      title: '删除中...',
    })
    db.collection('diary').doc(this.data.selectId).remove()
      .then(res => {
        console.log(res)
        this.onShow()
      }).catch(err => {
        console.log(err)
      })
  },
  // 长按
  longTap (e) {
    console.log(e)
    console.log('longTap')
    this.setData({
      selectId: e.target.dataset.id
    })
  },
  // 清除removerSelectId 
  removerSelectId () {
    this.setData({
      selectId: ''
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
    this.setData({
      selectId: ''
    })
    this.getTotalCount()
    this.getDiaryList()
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
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.getDiaryList()
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('diary')
      .where({
        _openid: app.globalData.openid
      })
      .orderBy('time', 'desc') // 时间 降序
      .skip(this.data.list.length) // 从指定序列后的结果开始返回，常用于分页
      .limit(this.data.pageSize) // 限制返回数量为 this.data.pageSize 条
      .get().then(res => {
        console.log(res)
        // debugger
        wx.hideLoading();//隐藏加载
        this.setData({
          list: this.data.list.concat(res.data)
        })
        if (res.data.length === 0 && this.data.list.length === this.data.totalCount) {
          wx.showToast({
            icon: 'none',
            title: '没有更多数据了',
          })
        }

        if (this.data.list === 0) {
          this.setData({
            showNoContent: true
          })
        }
      }).catch(err => {
        console.log(err)
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})