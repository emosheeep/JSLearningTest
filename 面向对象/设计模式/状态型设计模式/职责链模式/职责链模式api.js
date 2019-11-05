var http = require('http')

var server = http.createServer(function(req, res){
	console.log(req.url)

	var obj = {
		name: "小明",
		age: 15,
		saying: "我喜欢打篮球"
	}
	var arr = ["小明", 15, "我喜欢打篮球"]

	res.write(JSON.stringify(arr))
	res.end()
})

server.listen(3000, function(){
	console.log("服务已启动！")
})