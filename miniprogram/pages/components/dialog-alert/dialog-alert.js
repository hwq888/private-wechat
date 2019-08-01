// pages/components/dialog-alert/dialog-alert.js
// import Dialog from '/vant-weapp/dialog/dialog';
Component({
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
        },
        cancelBtn: {
          type: Boolean,
          value: false,
        },
        cancelBtnText: {
          type: String,
          value: '取消',
        },
        confirmButtonText: {
          type: String,
          value: '确认',
        },
        message: {
          type: String,
          value: '',
        }
      }
    }
    
  },

  /**
   * 组件的初始数据
   */
  data: {


  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
    ready: function () {
      // this.show()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirm: function () {
      console.log('确定')
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('alertCallBack', myEventDetail, myEventOption)
    }
  }
})
