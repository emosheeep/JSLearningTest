/**
 * 命令模式
 * 命令模式也是封装功能，提供高效的api，将命令的发起者者和执行者解耦
 * 命令的使用者不用知道具体的实现过程
 * 但是增加了系统的复杂度
 */
var excute = (function(){
	var template = {
		//图片结构模板
		image: (`
			<div>
				<img src="{{src}}">
				<p>{{text}}</p>
			</div>
		`),
		//标题结构模板
		title: (`
			<div class="title">
				<div class="main">
					<h3>{{title}}</h2>
					<p>{{tips}}</p>
				</div>
			</div>
		`)
	}
	//模板字符串替换函数，替换{{}}中的内容
	function formateString(str, obj){
		return str.replace(/\{\{(\w+)\}\}/g, function(match, key){
			return obj[key]
		})
	}
	//命令集合
	var Action = {
		/**
		 * 功能：创建模板字符串，并替换为自定义内容
		 * @param {Object/Array} data    显示的数据
		 * @param {String}       type    使用的模板类型（image/title）
		 */
		create: function(data, type){
			//字符串缓存
			var html = ''
			//解析数据，如果数据是一个数组，意思是要构造多个项目
			if (data instanceof Array) {
				data.forEach(function(item){
					html += formateString(template[type], item)
				})
			} else {
				//如果不是数组则单单只构造一个对象
				html += formateString(template[type], data)
			}
			return html
		},
		/**
		 * 功能：视图展示
		 * @param {String} containeriD         显示的容器
		 * @param {Object/Array} data          显示的数据
		 * @param {String} type                使用的模板类型（image/title）
		 */
		display: function(containerId, data, type){
			// 如果传入了数据返则回创建结果
			var html = data && this.create(data, type) || ''
			// 展示模块
			document.getElementById(containerId).innerHTML = html
		}
	}
	
	/**
	 * 命令接口
	 * {String}          cmd:        命令类型(create/display)
	 * {Object/Array}    params:     对应命令的参数
	 */
	return function({cmd, params}){
		//apply方法要求第二个参数为数组
		//判断params是否为数组
		params = params instanceof Array?params:[params]
		return Action[cmd].apply(Action, params)
	}
})()

//先在页面中添加一个容器
var titles = document.createElement('div'),
	images = document.createElement('div'),
	can = document.createElement('canvas')
can.id = 'canvas'
titles.id = 'titles'
images.id = 'images'
document.body.appendChild(can)
document.body.appendChild(titles)
document.body.appendChild(images)


//执行命令
excute({
	cmd: 'display',
	params: ['titles', [
		{
			title: '夏日里的一篇温馨',
			tips: '暖暖的温情带给人们家的感受'
		},
		{
			title: '每一片雪花都有它的意义',
			tips: '花点儿时间，反思一下'
		}
	], 'title']
})

excute({
	cmd: 'display',
	params: ['images', [
		{
			src: '../test.jpeg',
			text: '这是示例图片'
		}
	], 'image']
})

var div = document.createElement('div')
div.innerHTML = excute({
	cmd: 'create',
	params: [{
		title: '这是自定义标题',
		tips: '这是自定义内容'
	}, 'title']
})

document.querySelector("#titles").appendChild(div)


/**
 * 使用命令模式封装canvas
 */
var Canvas = (function(){
	var canvas = document.getElementById('canvas')
		ctx = canvas.getContext('2d') //获取canvas上下文引用
	
	//命令集合
	var Action = {
		//填充色彩
		fillStyle: function(color){
			ctx.fillStyle = color
		},
		strokeStyle: function(color){
			ctx.strokeStyle = color
		},
		//填充矩形
		fillRect: function(x, y, width, height){
			ctx.fillRect(x, y, width, height)
		},
		//描边矩形
		strokeRect: function(x, y, width, height){
			ctx.strokeRect(x, y, width, height)
		},
		//开启路径
		beginPath: function(){
			ctx.beginPath()
		},
		//移动画笔触点
		moveTo: function(x, y){
			ctx.moveTo(x, y)
		},
		//画笔连线
		lineTo: function(x, y){
			ctx.lineTo(x, y)
		},
		//绘制弧线
		arc: function(x, y, r, begin, end, dir){
			ctx.arc(x, y, r, begin, end, dir)
		},
		//填充
		fill: function(){
			ctx.fill()
		},
		//描边
		stroke: function(){
			ctx.stroke()
		}
	}
	
	//命令接口
	return function(msg){
		// 如果没有指令返回
		console.log(msg)
		if (!msg) return
		//如果msg是数组，则命令需要执行多次
		if(msg instanceof Array){
			for (let m of msg) {
				arguments.callee(m)
			}
		} else {
			if (!Action[msg.cmd]) {
				throw new Error("该命令不存在："+msg.cmd)
			}
			// apply要求第二参数为数组，若不是数组则转为数组
			msg.params = msg.params instanceof Array ? msg.params : [msg.params],
			Action[msg.cmd].apply(Action, msg.params)
		}
	}
})()
// 画一个时钟
Canvas([
	{cmd: "strokeStyle", params: "black"},
	{cmd: "beginPath"},
	{cmd: "arc", params: [60, 60, 50, 0, 2*Math.PI]},
	{cmd: "moveTo", params: [60, 60]},
	{cmd: "lineTo", params: [60, 20]},
	{cmd: "moveTo", params: [60, 60]},
	{cmd: "lineTo", params: [30, 60]},
	{cmd: "stroke"}
])