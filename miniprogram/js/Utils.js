/*
title：时间格式化
des： 使用： formatTime(time, 'yyyy-MM-dd hh:mm:ss')
time： 2019-07-30
*/
function formatTime(time, fmt) {
  var date = new Date(Number(time))
  const padLeftZero = (str) => {
    return ('00' + str).substr(str.length)
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}
// 把相关方法抛出去
module.exports = {
  formatTime: formatTime
}