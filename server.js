/*
 * @Author: your name
 * @Date: 2021-05-23 23:12:35
 * @LastEditTime: 2021-05-23 23:32:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /static-server/server.js
 */
var http = require("http")
var fs = require("fs")
var url = require("url")
var port = process.argv[2]

if (!port) {
  console.log("请指定端口号\n例如：node server.js 8888 ")
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ""
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"))
  }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  console.log("有请求过来啦！路径（带查询参数）为：" + pathWithQuery)

  response.statusCode = 200
  // 默认首页
  const filePath = path === "/" ? "/index.html" : path
  const index = filePath.lastIndexOf(".")
  // suffix 后缀
  const suffix = filePath.substring(index)
  const fileTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
  }
  response.setHeader(
    // 为避免用户输入其他类型引发错误，设置保底值 text/html
    "Content-Type",
    `${fileTypes[suffix] || "text/html"};charset=utf-8`
  )
  let content
  try {
    content = fs.readFileSync(`./public${filePath}`)
  } catch (error) {
    content = "文件不存在"
    response.statusCode = 404
  }
  response.write(content)
  response.end()
})

server.listen(port)
console.log("监听 " + port + " 成功\n打开 http://localhost:" + port)
