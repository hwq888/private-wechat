// pages/components/pass-word-dialog/pass-word-dialog.js
// const computedBehavior = require('miniprogram-computed')
const db = wx.cloud.database();
const app = getApp()
Component({
  // behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {
        show: {
          type: Boolean,
          value: false,
        }
      }
    }
  },
  // computed: {
  //   sum(data) {
  //     // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
  //     // 这个函数的返回值会被设置到 this.data.sum 字段中
  //     return data.a + data.b
  //   },
  // },
  // watch: {
  //   'a, b': function (a, b) {
  //     this.setData({
  //       sum: a + b
  //     })
  //   },
  // },
  /**
   * 组件的初始数据
   */
  data: {
    // a: 1,
    // b: 1,
    // sum: 2,
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
  /**
   * 组件的方法列表
   */
  methods: {
    bindKeyInput: function (e) {
      console.log(e)
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
    // 校验密码
    submit () {
      console.log('sumbit')
      // this.setData({ loading: true })
      // 查询当前用户是否已设置私密密码
      const _pwa = this.data.p1 + this.data.p2 + this.data.p3 + this.data.p4 + this.data.p5 + this.data.p6
      if (_pwa.length === 6) {
        wx.showLoading({
          title: '校验中...',
        })

        db.collection('passWord').where({ _openid: app.globalData.openid }).get().then(res => {
          console.log(res)
          wx.hideLoading()
          if (res.data[0].pwa === _pwa) {
            this.onClose()
            this.triggerEvent('passWordCallBack', true)
          } else {
            wx.showToast({
              icon: 'none',
              title: '密码错误，请重新校验！',
            })
            this.setData({
              p1: '',
              p2: '',
              p3: '',
              p4: '',
              p5: '',
              p6: '',
            })
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请输入6位密码',
        })
      }
      
    },
    // 关闭弹窗
    onClose(e) {
      console.log(e)
      this.setData({ 
        data:{
          show: false
        },
        p1: '',
        p2: '',
        p3: '',
        p4: '',
        p5: '',
        p6: '',
      })
    }
    // onTap() {
    //   this.setData({
    //     a: this.data.b,
    //     b: this.data.a + this.data.b,
    //   })
    // }
  }
})
