importScripts('https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.min.js')

self.onmessage = e => {
  const spark = new SparkMD5.ArrayBuffer()
  const hash = spark.append(e.data)
  self.postMessage(hash.end())
}
