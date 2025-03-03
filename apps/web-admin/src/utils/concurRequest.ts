export function concurRequest<T>(paramsArr: any[], request: (...args) => Promise<T>, maxNum: number = 3): Promise<T[]> {
  return new Promise(resolve => {
    if (!paramsArr.length) return resolve([])

    // 返回的结果
    const result = []
    // 请求的指向的索引
    let requestIndex = 0
    // 完成响应统计
    let finishCount = 0

    async function singleRequest() {
      // 当前函数响应时 结果保存的位置
      const resultSaveIndex = requestIndex
      try {
        const params = paramsArr[requestIndex]
        requestIndex++
        const response = await request(params)
        result[resultSaveIndex] = response
      } catch (e) {
        result[resultSaveIndex] = e
      } finally {
        finishCount++
        // 当请求索引小于参数数组 时表示还有未发生完成的请求
        if (requestIndex < paramsArr.length) singleRequest()

        // 当完成数量和 参数数组长度相同表示索引请求完毕
        if (finishCount === paramsArr.length) resolve(result)
      }
    }

    // 并发执行数
    for (let i = 0; i < Math.min(paramsArr.length, maxNum); i++) {
      singleRequest()
    }
  })
}
