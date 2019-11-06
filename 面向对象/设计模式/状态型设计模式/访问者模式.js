/**
 * 绑定事件的跨浏览器方式
 * @param {DOM} dom
 * @param {string} type
 * @param {Function} fn
 */
var bindEvent = function(dom, type, fn){
	if(dom.addEventLister){
		dom.addEventLister(type, fn, false)
	} else if (dom.attachEvent) {
		dom.attachEvent('on'+type, fn)
	} else {
		dom['on'+type] = fn
	}
}

//创建示例元素
var btn = document.createElement('button')
btn.innerHTML = 'Click me'

/**
 * 访问者模式的思想是，在不改变元素的情况下，为它添加新的方法
 * 来实现对操作对象的访问
 * 
 * 此处对上面的bindEvent对象进行改造
 */

var bindEvent = function(dom, type, data, fn){
	data = data || {}
	if(dom.addEventListener){
		dom.addEventListener(type, function(event){
			fn.call(dom, event, data)
			console.log(data)
		}, false)
	} else if (dom.attachEvent) {
		dom.attachEvent('on'+type, function(event){
			fn.call(dom, event, data)
		})
	} else {
		dom['on'+type] = fn
		console.info("DOM 0级方法")
	}
}

bindEvent(btn, "click", {name: "李明", age: 12}, function(event, data){
	console.log(event.target)
	// console.log(data)
})
document.body.appendChild(btn)

/**
 * 利用访问者魔模式，增强类数组对象，
 * 主要是对apply方法和call方法的运用，要注意两者区别
 */
var Visitor = (function(){
	return {
		//模拟数组原生截取方法
		splice: function(){
			// splice方法参数，从传入参数第二个开始算起
			var args = Array.prototype.splice.call(arguments, 1),
				obj = arguments[0]
				// console.log(args)
			// 在传入的对象上调用splice方法，并传入参数，模拟数组原生方法splice
			return  Array.prototype.splice.apply(obj, args)
		},
		//模拟数组的push方法，为对象添加数据
		push: function(){
			var obj = arguments[0],
				len = obj.length || 0, // 强化类数组对象，使它拥有length属性
			// 添加的数据从参数的第二个开始
				args = this.splice(arguments, 1)
			// 更新length属性
			obj.length = len + arguments.length - 1
			// 为对象添加数据
			return Array.prototype.push.apply(obj, args)
		},
		//弹出最后一次添加的一个元素
		pop: function(){
			return Array.prototype.pop.apply(arguments[0])
		}
	}
})()
var obj = new Object()
Visitor.push(obj, 1, 2, 3, 4)
// Visitor.splice(obj, 2)
console.log(obj)


/**
 * 可以利用工厂模式直接创造一个有这些特殊方法的对象
 */
var LikeObj = function(){
	this.length = 0	// 使类数组对象拥有length属性
	// 如果传入参数则push
	if (arguments.length != 0) {
		for (var item of arguments){
			this.push(item)
		}
	}
}
LikeObj.prototype = {
	constructor: LikeObj,
	//模拟数组splice方法
	splice: function(){
		// 将参数从arguments中分离出来
		var args =  Array.prototype.splice.call(arguments, 0)
		return  Array.prototype.splice.apply(this, args)
	},
	//模拟数组的push方法，为对象添加数据
	push: function(){
		// 将参数从arguments中分离出来
		var args = Array.prototype.splice.call(arguments, 0)
		
		return Array.prototype.push.apply(this, args)
	},
	//弹出最后一次添加的一个元素
	pop: function(){
		return Array.prototype.pop.call(this)
	}
}
var likeobj = new LikeObj(1,2,3,4)
console.log(likeobj)
likeobj.push(5,6,7,8)
console.log(likeobj)
likeobj.pop()
console.log(likeobj)
likeobj.splice(5)
console.log(likeobj)

var o = {}
o.length = 0
console.log(o)