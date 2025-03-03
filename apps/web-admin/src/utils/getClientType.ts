/**
 * 获取当前终端设备类型
 * @author Peng
 * @date 2023-04-14
 * @returns {any}
 */

function getClientType(): string {
  const device = navigator.userAgent
  if (innerWidth < 570) {
    return 'phone'
  } else if (device.indexOf('iPad') > -1) {
    return 'pad'
  } else if (device.indexOf('Android') > -1 || device.indexOf('ios') > -1) {
    return 'phone'
  } else {
    return 'pc'
  }
}

export default getClientType
