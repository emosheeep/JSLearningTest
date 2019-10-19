/*
 * js高级技巧
 */

//函数绑定，将函数作为参数传递时保留其作用域
/*var handler = {
	message: "a message",
	
	print: function(item, index, array){ //模拟事件处理程序
		console.log(this.message+"\t"+item.toString()+"\t"+index.toString())
	}
}

var arr = [1,2,3,4,5]
arr.forEach(handler.print) //错误，执行环境改变，无法访问message变量
arr.forEach(handler.print.bind(handler)) // 正确*/

/*
 * 惰性载入函数 
 */

var flag = "Array" //模拟浏览器的能力

function Func(){ //示例函数
	//能力检测，兼容浏览器，但由于浏览器环境一般是不可能改变的
	//所以实际上总是只会执行一种代码，其他代码是多余的。总是经过分支判断会影响性能
	if(flag == "Array"){ 
		return new Array()
	}
	else if (flag == "Number") {
		return new Number()
	}
	else {
		throw new Error("not availiable!")
	}
}
// 1.运行时重载
/*function create(){
	if(flag == "Array"){ 
		//局部覆盖函数
		create = function () { 
			return new Array()
		}
	}
	else if (flag == "Number") {
		//局部覆盖函数
		create = function () {
			return new Number()
		}
	}
	else {
		//局部覆盖函数
		create = function () {
			throw new Error("not availiable!")
		}
	}
}
create() // 运行以后发现函数已经被覆盖成了需要的版本，以后调用便不需要经过分支语句，从而节省性能
console.log(create.toLocaleString())*/

//2.创建时重载
/*var create = (function(){ //使用匿名函数返回函数的方式函数
	if(flag == "Array"){ 
		//根据环境条件具体返回所需要的函数
		return function () { 
			return new Array()
		}
	}
	else if (flag == "Number") {
		return function () {
			return new Number()
		}
	}
	else {
		return function () {
			throw new Error("not availiable!")
		}
	}
})()
console.log(create.toLocaleString())*/

/*
 * 函数柯里化：用于创建已经设置好了一个或多个参数的函数
 * 柯里化函数：用来执行函数柯里化这一个过程的函数
 * 
 * 柯里化函数的动态创建过程:调用一个函数并为他传入要被柯里化的函数和参数
 * 
 * 函数柯里化的应用：在事件处理函数当中，当你除了event对象再额外给事件处理函数传递参数的时候，非常有用
 */
//柯里化函数
/*function curry(fn){
	var args = Array.prototype.slice.call(arguments,1) // 先获取该外部函数的其余参数
	return function(){
		var innerArgs = Array.prototype.slice.call(arguments) // 获取返回的函数的参数
		console.log(innerArgs)
		var finalArgs = args.concat(innerArgs)
		console.log(finalArgs)
		return fn.apply(null, finalArgs)
	}
}

function add(num1, num2){ // 这是要进行柯里化的函数
	return num1 + num2
}

var finalFunc = curry(add, 1) // 这里的参数1即为上面函数中的args
console.log(finalFunc(5)) // 这里传入的5即innerArgs*/



/*
 * 防篡改对象：利用对象的属性特点设置[[Configurable]]、[[Writable]]、[[Enumberable]]、[[Value]]、[[Get]]、[[Set]]
 */
var person = {
	name: "秦始皇"
}
person.work = "皇帝"

//不可扩展的对象

/*console.log("是否可扩展："+Object.isExtensible(person))
Object.preventExtensions(person) //阻止对象扩展
console.log("是否可扩展："+Object.isExtensible(person))

person.age = 10 //该属性未添加上去
console.log(Object.keys(person))*/

//密封的对象————密封对象不可扩展，而且已有成员的[[Configurable]]属性将被设置成false
//						即不能delete对象的属性和方法

/*Object.seal(person)
delete person.name //该操作无效
person.age = 10 //该属性也未添加上去
console.log(Object.keys(person))
console.log(Object.isSealed(person))*/

// 冻结的对象，冻结的对象既不可扩展，又是密封的，而且所有属性都变成了只读模式，即设置了[[Writable]]为false
/*Object.freeze(person)
delete person.name //该操作无效
person.age = 10 //该属性也未添加上去
person.name = "嬴政"
console.log(person.name)
console.log(Object.keys(person))
console.log(Object.isSealed(person))
console.log(Object.isExtensible(person))*/



/*
 * 高级定时器
 * 
 */

//链式setTimeout————好处在于在一个定时器代码执行完成之前不会向队列中插入新的定时器代码，可以保证至少经过一定的间隔之后才会执行一次代码
//   setInterval可能存在，一次代码还没执行完毕就在待执行的代码队列里插入下一段代码。
//链式setTimeout可以用来处理数组分块的问题，即如果一个数组过于庞大的话，连续处理会使得脚本长时间运行，
//	长时间运行脚本可能会被浏览器阻止，所以采用数组分块的模式配合链式setTimeout，可以

/*setTimeout(function(){
	console.log(new Date().toTimeString())
	setTimeout(arguments.callee, 1000)
},1000)*/



/*
 * 函数节流————防止某些操作频繁触发，使用函数限流进行限制
 * 由于nodejs无法交互，无法看出效果，所以具体内容写在了index.js中，并将事件绑定给了蓝色发送消息按钮
 */

/*
 * 自定义事件：利用设计模式之观察者模式
 */
function EventTarget(){
	this.handlers = {}
}

EventTarget.prototype = {
	constuctor: EventTarget,
	// 事件添加程序，参数：事件类型，处理函数
	addHandler: function(type, handler){
		//查看对应类型的事件是否已经注册。如传入message事件发现不存在，则创建该事件的数组，以便将来存放事件处理程序
		if (!this.handlers[type]) {
			this.handlers[type] = []
		}
		this.handlers[type].push(handler) //将事件处理程序添加至对应的事件数组中
	},
	// 触发事件
	fire: function(event){//event对象必须是一个至少包含type属性的对象
		if (!event.target) {
			//事件对象中没有设置事件目标则先设置事件目标
			event.target = this
		}
		//该事件是否已经注册
		if (this.handlers[event.type] instanceof Array) {
			this.handlers[event.type].forEach(function(handler){
				handler(event); //将对应事件的数组里面面保存的方法挨个执行，并且传入事件对象
			})
		}
	},
	removeHandler: function(type, handler){
		//该事件是否已经注册
		if (this.handlers[type] instanceof Array) {
			//将该事件从事件数组中移除
			var handlers = this.handlers
			for (var i=0; i<handlers.length; i++){
				if (handlers[type] == handler) {
					break;
				}
			}
			this.handlers.splice(i, 1) //这里直接使用i是因为变量i使用var声明，循环外部也可以访问到
		}
	}
}

// 创建事件对象
var Event = new EventTarget()

//添加事件
Event.addHandler("message", postMsg)
function postMsg(event){
	console.log(event.message)
}

//触发事件
var event = {
	type: 'message',
	message: '我是消息'
}
Event.fire(event)
