/**
 * 搜索关键字高亮
 * @author Peng
 * @date 2023-04-18
 * @param {any} str:string
 * @param {any} queryStr:string
 * @returns {any}
 */
export const queryStrHighlight = (str: string, queryStr: string) => {
  if (!str) return str
  const regex = new RegExp(queryStr, 'ig')
  return str.replace(regex, `<font color="red">$&</font>`)
}
