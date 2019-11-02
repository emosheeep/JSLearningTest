/**
 * 观察者模式
 */
var Observer = (function(){
	//防止消息暴露而被篡改，将消息作为静态私有变量保存
	var __message = {}
	return {
		//注册
		register: function(type, fn){
			if (!__message[type]) {
				//要是不存在则新建事件队列
				__message[type] = []
			}
			//如果对应类型的消息已经存在, 直接推入队列即可
			__message[type].push(fn)	
			return this //链式调用
		},
		 //触发
		fire: function(type, data){
			if(!__message[type]) return
	
			//执行消息对应事件队列里所有函数
			__message[type].forEach(function(handler){
				handler(data)
			})
		},
		 //移除
		remove: function(type, fn){
			if (__message[type] instanceof Array){
				__message[type].forEach(function(item, index, array){
					item === fn && array.splice(index, 1) //若存在对应函数则移除，注意此处利用与表达式的短路特性
				})
			}
		} 
	}
})()

/**
 * 注册两个事件处理程序
 */
/* Observer.register("test", handler)
Observer.register('test', handler2)
function handler(event){
	console.log("这是事件1"+JSON.stringify(event))
}
function handler2(event){
	console.log("这是事件2"+JSON.stringify(event))
}
//触发事件
Observer.fire('test',{
	data: "首次触发"
})

//移除事件处理函数
Observer.remove('test',handler)

//再次出发，事件一莫得了
Observer.fire('test',{
	data: "再次触发"
}) */



/**
 * 模拟一个评论的管理
 */

var container = document.createElement('div')
container.innerHTML = `
	<h3>最新消息发布&nbsp;&nbsp;<span id="msgNum">0</span></h3>
	<ul id="comment"></ul>
	<input type="text" id="input">
	<button id="submit">提交</button>
`.trim()
document.body.appendChild(container)
var comment = document.getElementById('comment'),
	input = document.getElementById('input'),
	submit = document.getElementById('submit'),
	msgNum = document.getElementById('msgNum')

Observer.register('addComment', function(event){
	var li = document.createElement('li'),
		btn = document.createElement('button')
	li.innerHTML = event.data.text
	btn.innerHTML = "关闭"
	btn.onclick = function(){
		comment.removeChild(li)
		Observer.fire('removeComment',{
			data: {
				num: -1  //需要改变消息的条数
			}
		})
	}
	li.appendChild(btn)
	comment.appendChild(li)
})
.register('addComment', changeComment)
.register('removeComment', changeComment)


// 改变评论条数
function changeComment(event){
	var num = event.data.num
	msgNum.innerHTML = parseInt(msgNum.innerHTML) + num
}


//提交按钮绑定事件
submit.onclick = function(){
	if (input.value=="") return
	Observer.fire('addComment',{
		data: {
			text: input.value,
			num: 1 //需要改变消息的条数
		}
	})
	input.value = ""
}