// self 是 worker 线程中独有的变量 类似 主线程 中的 window
console.log(' 创建文件分片执行 ------', self)
// importScripts
// 用于接收 主线程 postMessage 发送过来的消息
self.onmessage = e => {
  console.log(e)
}
