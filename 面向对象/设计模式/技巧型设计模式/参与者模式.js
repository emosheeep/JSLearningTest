/**
 * 参与者模式
 * 在特定的作用域中执行给定的函数，并将参数原封不动的传递
 * 
 * 参与者模式实际上是函数绑定与函数柯里化两种技术的结晶
 */



// 函数绑定之bind方法
function bind(fn, context){
	return function(){
		return fn.apply(context, arguments)
	}
}

var btn = document.createElement('button')
btn.innerHTML = "点我"
document.body.appendChild(btn)

function demoFn(){
	console.log(arguments, this)
}
// 可以绑定作用域
btn.addEventListener('click', bind(demoFn, {name: "这是click作用域"}))

// 还可以使用原生的bind方法
btn.addEventListener("mouseover", demoFn.bind({name: "这是mouseover作用域"}))
/**
 * 函数柯里化
 */
function curry(fn, ...args){
	return function(...addArgs){
		// 将外部传入的参数和预定义的参数拼接起来
		var allArgs = args.concat(addArgs)
		return fn.apply(null, allArgs)
	}
}

function add(num1, num2){
	return num1 + num2
}
function add5(num){
	return add(5, num)
}
// 测试
console.log("add(1, 2) =", add(1, 2))
console.log("add5(1) =", add5(1))

var add7 = curry(add, 7) // 这里的7就是curry中的..args

console.log("add7(8) =", add7(8)) // 这里的8就是curry中的..addArgs

/**
 * 有时候为了统一实现，在不支持原生bind方法的浏览器中
 * 可以手动为原生Funciton类型添加bind方法 
 */
if (!Function.prototype.bind){
	Function.prototype.bind = function(context, ...outArgs){
		var _this = this // 保存this
		return function (...inArgs) {
			// 注意将传入的参数放在后面
			var allArgs = outArgs.concat(inArgs)
			console.log(outArgs)
			return _this.apply(context, allArgs)
		}
	}
}
// 下面借用示例
function Fn(...args){
	console.log(args)
}
Fn.bind({name: "这是要绑定的作用域"}, "额外参数")("调用时传入的参数")


// Fn.bind()方法调用结束后会返回一个函数,假设返回的这个函数是fn,则
// 将它放在addEventListener('click', Fn.bind())
// 相当于是addEventListener('click', fn),
// fn将会获得调用时传入的参数，于是就得到了事件参数event

/**
 * 反柯里化，为了方便对方法的调用
 */
Function.prototype.uncurry = function(){
	// 保存了当前函数，此处是Arry.prototype.push
	var self = this
	console.log(self)
	/* return function(){
		return Function.prototype.call.apply(self, arguments)
		//相当于 self.call(arguments)
		// arguments的第一个参数即为通过call方法绑定的作用域
	} */
	return this.call.bind(this)  // call函数绑定push作用域
}
var push = [].push.uncurry()
var obj = {}
push(obj, 1, 2)

console.log(obj)

var D = document.getElementsByTagName.bind(document)
console.log(D("button"))

