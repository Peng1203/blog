/**
 * 统计 字符串中指定字符出现的次数
 * @date 2023/10/11 - 13:53:29
 * @author Peng
 *
 * @export
 * @param {string} str 字符串
 * @param {string} chat 指定字符
 * @returns {number}
 */
export function countOccurrences(str: string, chat: string): number {
  // let count: number = 0;
  // for (const currentChat of str) {
  //   if (currentChat === chat) count++;
  // }
  // return count;

  const regex = new RegExp(chat, 'g')
  const matches = str.match(regex)
  return matches ? matches.length : 0
}
