// miniprogram/pages/views/memorandum/memorandum.js
const db = wx.cloud.database();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectId: "", // // 选中便签id
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
    db.collection('memorandum')
      .where({
        _openid: app.globalData.openid
      })
      .count()
      .then(res => {
        this.setData({
          totalCount: res.total
        })
        if (this.data.totalCount === 0) {
          this.setData({
            showNoContent: true
          })
        }
      })
  },
  // 获取便签列表-初始化
  getMemorandumList: function () {
    this.setData({
      list: []
    })
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('memorandum')
      .where({
        _openid: app.globalData.openid
      })
      .orderBy('time', 'desc') // 时间 降序
      // .skip(this.data.list.length) // 从指定序列后的结果开始返回，常用于分页
      .limit(this.data.pageSize) // 限制返回数量为 this.data.pageSize 条
      .get().then(res => {
        console.log(res)
        wx.hideLoading();//隐藏加载
        this.setData({
          list: this.data.list.concat(res.data)
        })
        if (res.data.length === 0 && this.data.list.length === this.data.totalCount && this.data.totalCount !== 0) {
          wx.showToast({
            icon: 'none',
            title: '没有更多数据了',
          })
        }

        // if (this.data.list === 0) {
        //   this.setData({
        //     showNoContent: true
        //   })
        // }
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
  
  // 跳转到发布便签
  onLinkRelease: function () {
    wx.navigateTo({
      url: '../release/release?type=2'
    })
  },
  // 编辑便签
  onLinkEdit: function () {
    wx.navigateTo({
      url: `../release/release?type=2&id=${this.data.selectId}`
    })
  },
  // 删除便签
  onLinkDel: function () {
    this.setData({
      alertData: {
        show: true,
        cancelBtn: true,
        cancelBtnText: '取消',
        confirmButtonText: '删除',
        message: '您确定删除这条便签？'
      }
    })
  },
  // 确认删除便签
  alertCallBack() {
    wx.showLoading({
      title: '删除中...',
    })
    db.collection('memorandum').doc(this.data.selectId).remove()
      .then(res => {
        console.log(res)
        this.onShow()
      }).catch(err => {
        console.log(err)
      })
  },
  // 长按
  longTap(e) {
    console.log(e)
    console.log('longTap')
    this.setData({
      selectId: e.target.dataset.id
    })
  },
  // 清除removerSelectId 
  removerSelectId() {
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
      selectId: '',
      showNoContent: false
    })
    this.getTotalCount()
    this.getMemorandumList()
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
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('memorandum')
      .where({
        _openid: app.globalData.openid
      })
      .orderBy('time', 'desc') // 时间 降序
      .skip(this.data.list.length) // 从指定序列后的结果开始返回，常用于分页
      .limit(this.data.pageSize) // 限制返回数量为 this.data.pageSize 条
      .get().then(res => {
        console.log(res)
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