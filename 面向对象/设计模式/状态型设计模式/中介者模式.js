/**
 * 中介者模式
 * 类似于访问者模式，但是是单向的
 */
//中介者对象
var Mediator = function(){
	//消息对象
	var message = {}
	return {
		/**
		 * 消息注册
		 * @param {String}    type  消息名称
		 * @param {Function}  fn    回调函数
		 */
		register: function(type, fn){
			if(!message[type]){
				message[type] = []
			}
			message[type].push(fn)
		},
		/**
		 * 消息触发
		 * @param {String}   type   消息名称
		 */
		send: function(type){
			if (!message[type]){
				throw new Error(type+"事件暂未注册")
			}
			//遍历已寸处的消息回调函数
			message[type].forEach(function(item){
				item()
			})
		}
	}
}()
/**
 * 单元测试
 */
/* Mediator.register("demo", function(){
	console.log("first")
})
Mediator.register("demo", function(){
	console.log("second")
})
//发布消息
Mediator.send("demo") */



/**
 * 创建用户导航测试界面
 */
var html = `
	<div id="collection_nav" style="border: 1px solid red; display: flex;flex-wrap: wrap;">
		<div >
			<span>百度</span>
			<a href="http://www.baidu.com">http://www.baidu.com</a>
		</div>
		<div>
			<span>淘宝</span>
			<a href="http://www.taobao.com">http://www.taobao.com</a>
		</div>
		<div>
			<span>哔哩哔哩</span>
			<a href="https://www.bilibili.com/">https://www.bilibili.com/</a>
		</div>
		<div>
			隐藏标题：<input type="checkbox" name="title">
			隐藏网址：<input type="checkbox" name="url">
		</div>
	</div>
`
var div = document.createElement('div')
div.innerHTML = html
document.body.appendChild(div)


/**
 * 订阅消息
 */
/**
 * 控制模块的显示和隐藏
 * @param {Object} mod           模块ID
 * @param {Object} tag           处理的标签
 * @param {Boolean} showOrHide    显示还是隐藏
 */
var NavToggle = function(mod, tag, showOrHide){
	var mod = document.getElementById(mod),
		tag = mod.getElementsByTagName(tag)
	showOrHide = (showOrHide == true ? 'visible' : 'hidden')
	for (var item of tag) {
		item.style.visibility = showOrHide
	}
	
	// 利用访问者模式
	/* Array.prototype.forEach.call(tag, function(item){
		item.style.visibility = showOrHide
	}) */
}

// 订阅隐藏导航栏
Mediator.register("hideAllNav", function(){
	NavToggle('collection_nav', 'span', false)
})
// 订阅显示导航栏
Mediator.register("showAllNav", function(){
	NavToggle('collection_nav', 'span', true)
})
// 订阅隐藏导航网址
Mediator.register("hideAllNavUrl", function(){
	NavToggle('collection_nav', 'a', false)
})
// 订阅显示导航网址
Mediator.register("showAllNavUrl", function(){
	NavToggle('collection_nav', 'a', true)
})

/**
 * 发布消息
 */
var hideTitle = document.querySelector("input[name='title']"),
	hideUrl = document.querySelector("input[name='url']")
hideTitle.onchange = function(event){
	if (event.target.checked){
		Mediator.send("hideAllNav")
	} else {
		Mediator.send("showAllNav")
	}
}
hideUrl.onchange = function(event){
	if (event.target.checked){
		Mediator.send("hideAllNavUrl")
	} else {
		Mediator.send("showAllNavUrl")
	}
}

/**
 * 利用中介者模式控制盒子上下移动
 */
//插入测试元素
div = document.createElement('div')
div.innerHTML = `<div id='box'
					  style='width: 50px;
							 height: 50px;
							 background-color: red;
							 position: absolute;
							 top: 140px;left: 100px'>
				</div>`.trim()
document.body.appendChild(div)

var move = function(id, type){
	var box = document.getElementById(id),
		_top = parseInt(box.style.top.slice(0, -2)),
		_left = parseInt(box.style.left.slice(0, -2)) 
	
	switch(type){
		case "up":
			box.style.top = (_top-20) + "px"
			break
		case "down":
			box.style.top = (_top+20) + "px"
			break
		case "left":
			box.style.left = (_left-20) + "px"
			break
		case "right":
			box.style.left = (_left+20) + "px"
			break
	}
}
//注册事件
Mediator.register("up", function(){
	move("box", "up")
})
Mediator.register("down", function(){
	move("box", "down")
})
Mediator.register("right", function(){
	move("box", "right")
})
Mediator.register("left", function(){
	move("box", "left")
})

window.onkeydown = function(event){
	console.log(event.key)
	switch(event.key){
		case "ArrowUp":
			Mediator.send("up")
			break
		case "ArrowDown":
			Mediator.send("down")
			break
		case "ArrowLeft":
			Mediator.send("left")
			break
		case "ArrowRight":
			Mediator.send("right")
			break
	}
}