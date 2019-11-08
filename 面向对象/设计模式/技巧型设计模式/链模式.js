/**
 * 链模式
 * 通过在对象方法中返回当前对象，实现对同一个对象多个方法的链式调用
 * 典型例子————jQuery的实现原理
 * 
 * 链模式可以提高功能的开发效率，降低开发成本，简洁明了
 */

// 构建页面测试元素
var div = document.createElement('div'),
	span = document.createElement('span')
div.innerHTML = "假装我是个按钮"
span.innerHTML = "我是span"
div.className = 'demo'
span.className = 'demo'
document.body.appendChild(div)
document.body.appendChild(span)


/**
 * jQuery的实现原理
 * @param {String} selector 选择符
 */
var A = function(selector){
	return new A.fn.init(selector)
}
A.fn = A.prototype = {
	constructor: A,
	init: function(selector, context){
		this.length = 0
		context = context || document
		
		// 保存选择的集合（NodeList）
		var collection = context.querySelectorAll(selector)
		// 将选择结果当作元素的属性值保存起来
		this.push(collection)
		
		// 保存上下文和选择符
		this.context = context
		this.selector = selector

		return this // 返回当前对象
	},
	length: 0,
	size: function(){
		return this.length
	},
	// 增加几个数组常用方法，增强对象的数组特性，这样控制台打印出来就是数组的形式了
	push: function(arr){
		Array.prototype.push.apply(this, arr)
	},
	forEach: function(fn){
		Array.prototype.forEach.call(this, fn)
	},
	splice: function(){}
}

A.fn.init.prototype = A.fn

console.log(A("script"))
console.log($(".demo"))

// 对象拓展
A.extend = A.fn.extend = function(){
	// 拓展对象从第二个参数算起
	var i = 1,
		// 获取参数长度
		len = arguments.length,
		// 第一个参数为源对象
		target = arguments[0],
		// 拓展对象中的属性
		j;
	// 如果只有一个参数
	if (i == len) {
		//源对象为当前对象
		target = this
		i--
	}
	// 遍历参数中拓展的对象
	for(; i < len; i++){
		// 遍历拓展对象中属性
		for (j in arguments[i]) {
			target[j] = arguments[i][j] // 拓展源对象
		}
	}
	return target
}
// 测试
/* var obj = {
	name: "xiaoming",
	age: 14
}
A.extend(obj, {
	weight: "69kg",
	height: "180cm"
})
console.log(obj) */

A.fn.extend({
	//添加事件,利用惰性载入的方式
	on: (function(){
		//DOM2级
		if(document.addEventListener){
			return function(type, fn){
				var i = this.length - 1
				for (; i>=0; i--){
					this[i].addEventListener(type, fn, false)
				}
				return this
			}
		} else if(document.attachEvent){
			return function(type, fn){
				var i = this.length - 1
				for (; i>=0; i--){
					this[i].attachEvent('on'+type, fn)
				}
				return this
			}
		} else {
			return function(type, fn){
				var i = this.length - 1
				for (; i>=0; i--){
					this[i]['on'+type] = fn
				}
				return this
			}
		}
	})(),
	// 设置css样式
	css: function(){
		var args = arguments
		// 如果只有一个参数则
		if (args.length == 1){
			// 获取相应的css属性值
			if (typeof args[0] === "string"){
				// 浏览器兼容方案
				return this[0].currentStyle
						?this[0].currentStyle[args[0]]
						:getComputedStyle(this[0])[args[0]]
			} else if (typeof args[0] === "object") {
				// 遍历参数对象
				for (let property in args[0]) {
					this.forEach(function(item){
						item.style[property] = args[0][property]
					})
				}
			}
		// 两个参数则设置一个样式
		} else if (args.length == 2) {
			this.forEach(function(item){
				item.style[args[0]] = args[1]
			})
		}
		return this
	},
	// 设置元素内容
	html: function(){
		var args = arguments
		// 如果没有参数则获取第一个元素内容
		if (args.length == 0){
			return this[0] && this[0].innerHTML
		// 一个参数则设置样式
		} else if (args.length == 1) {
			this.forEach(function(item){
				item.innerHTML = args[0]
			})
		}
		return this
	}
})
A(".demo").on("click", function(){
	console.log("我被点击了！")
}).on("mouseover", function(){
	console.log("有鼠标从我上空划过")
})

A(".demo").css({
	"color": "white",
	"background-color": "grey"
}).css("fontSize","20px")

A("span.demo").html("我是span, 我的内容被html()设置了")
