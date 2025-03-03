// 密码强度检测
export const passwordStrengthLevelDetection = (value: string): number => {
  if (!value) return 0

  const illegalChars = /[:;"'[\]{}()_\-+=~]/

  if (value.search(illegalChars) !== -1) return -1

  let level = 1
  // 弱
  // let enoughRegex = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;
  let enoughRegex = /^(?:\d+|[a-zA-Z]+)$/

  // 中
  // let mediumRegex = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
  // let mediumRegex = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d.!@#$%^&*]+$/;
  let mediumRegex =
    /^(?:(?=.*\d)(?=.*[a-zA-Z])|(?=.*\d)(?=.*[,.!@#$%^&*])|(?=.*[a-zA-Z])(?=.*[,.?!@#$%^&*]))[\w,.?!@#$%^&*]+$/

  // 强
  //let strongRegex = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$ /;
  let strongRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[,.?!@#$%^&*])[\w,.?!@#$%^&*]+$/

  if (enoughRegex.test(value)) level = 1
  if (mediumRegex.test(value)) level = 2
  if (strongRegex.test(value)) level = 3

  return level
}
