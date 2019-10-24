
/**
 * ----------------------设计模式基础----------------------------
 */

//-----------------------用对象封装一个控制类
/*var checkBox = function(){
	this.checkName = function(){
		console.log("姓名已经检查")
		return this //实现方法的链式调用
	}
	this.checkEmail = function(){
		console.log("邮箱已经检查")
		return this
	}
}
var checkObj = new checkBox()
checkObj.checkName().checkEmail() // 链式调用*/

//---------------------利用原型添加方法
/*Function.prototype.addMethod = function(name, fn){
	this[name] = fn
	return this
}
var checkFunc = function(){}
checkFunc.addMethod("checkName", function(){
	console.log("姓名检查完成")
	return this
}).addMethod("checkEmail", function(){
	console.log("邮件检查完成")
	return this
})
checkFunc.checkEmail().checkName()
*/

// -------------------------------模仿面向对象语言中的类的概念，使用闭包创建完整的类
/*var Book = (function(){
	//静态私有变量
	var bookNum = 0

	//静态私有方法
	function checkBook(){}

	//定义构造函数（创建类）
	function _book(newId, newName, newPrice){
		//使用安全模式
		if (this instanceof Book) {
			//定义私有变量
			var name, price

			//公有变量
			this.id = newId
			//定义私有方法
			function checkID(ID){
				console.log("执行了一些操作——检察书籍")
			}

			//定义特权方法
			this.getPrice = function(){	return price }
			this.getName = function(){ return name }
			this.setPrice = function(bookprice){ price = bookprice	}
			this.setName = function(bookname){ name = bookname }

			//定义公有方法
			this.copy = function(){
				console.log("已复制！")
			}

			//书籍数量加一
			bookNum++
			if(bookNum > 100){
				throw new Error("我们只出版10本书")
			}

			//构造器
			this.setPrice(newPrice)
			this.setName(newName)
		} else {
			return new _book(newId, newName, newPrice)
		}
	}

	//构造原型
	_book.prototype = {
		//静态公有属性
		isJSBook: false,

		//静态公有方法
		display: function(){
			console.log("书名:"+this.getName()+" 价格："+this.getPrice())
		},
		deleteBook: function(book){
			// book = null
			// bookNum--
		}
	}

	//返回类
	return _book
})()

var book1 = new Book(1, "JavaScript高级程序设计", 99)
var book2 = Book(2, "图解CSS", 89) //由于添加了安全模式所以此处如果忘记了写new操作符也无大碍

book1.display()

console.log(book1 instanceof Book)*/


/**
 * ---------------------设计模式------------------------
 */

//------------------------普通工厂模式

/*var Java = function(content){//定义需要的类
	this.content = content
	console.log(content)
}
var UI = function(content){
	this.content = content
	console.log(content)
}

var Factory = function(type, content){//定义工厂
	switch(type){
		case 'Java':
			return new Java(content)
			break
		case 'UI':
			return new UI(content)
			break
		default:
			throw new Error("无法创建该类型的对象！")
	}
}*/
//====> 当类的种类越来越多......在定义新类的同时还需要修改工厂，
//		每一个需求都要修改两处，很浪费精力，不划算，于是出现了工厂方法模式



//------------------------工厂方法模式
/**
 * 其实就是将类（构造函数）写在了工厂的原型中，而工厂只是定义了一个既定的过程，根据传入的参数
 * 来调用原型中相应的构造函数，这部分流程是固定的，无需改变。
 * 随着类的增加，工厂方法模式只需要在原型中添加类即可，但普通工厂模式既需要编写新类，还需要修改工厂方法，
 * 非常花费时间，所以该模式适合类的种类繁多的情况
 */

//此处在构造函数中使用安全模式封装，
/*var Factory = function(type, content){
	if (this instanceof Factory) {
		var s = new this[type](content) //调用原型中的构造函数
		//构造函数在没有return语句时会自动返回新创建的对象，
		//但是加上return语句后会重写构造函数的返回值
		return s  
	} else {
		return new Factory(type, content)
	}
}
Factory.prototype = {
	Java: function(content){
		this.content = content
		console.log(content)
	},
	JavaScript: function(content){
		this.content = content
		console.log(content)
	},
	UI: function(content){
		this.content = content
		console.log(content)
	}
}
var js = new Factory('JavaScript','JS！你值得拥有！')
console.log(js)*/

//------------------------抽象工厂模式
//定义抽象工厂
var AbstractFactory = function(childClass, parentClass){ 
	// 判断是否存在抽象类
	if (typeof AbstractFactory[parentClass] === 'function') { //  寄生式继承
		var F = function(){}  //定义一个过渡类
		//继承抽象类的实例属性和原型中的方法
		//实例属性和原型属性是不一样的，实例的属性属于实例，是实例自己的。而原型属性属于所有实例，是共有的
		//从继承的角度来讲，将父类的所有属性方法（即父类原型中的属性和方法与父类实例中的属性和方法）全部
		//添加到子类原型中才是最终目标，这样子类的所有实例都会附带父类的方法和属性
		F.prototype = new AbstractFactory[parentClass]() //利用过渡类将父类实例属性转化为原型属性
		childClass.constructor = childClass // 修正constructor属性
		//子类原型继承父类,注意这里需要继承父类的属性，所以要new一下
		childClass.prototype = new F()
		
		console.log(childClass.constructor)
	} else {
		throw new Error('未创建该抽象类！')
	}
}

AbstractFactory.Car = function(){	// 在工厂中定义抽象类
	this.type = 'car' // 定义抽象类的属性
}
AbstractFactory.Car.prototype = { //定义抽象类的方法
	getPrice: function(){
		throw new Error('抽象方法不能直接调用！')
	},
	getSpeed: function(){
		throw new Error('抽象方法不能直接调用！')
	}
}
AbstractFactory.Bus = function(){	// 在工厂中定义抽象类
	this.type = 'bus' // 定义抽象类的属性
}
AbstractFactory.Bus.prototype = { //定义抽象类的方法
	getPrice: function(){
		throw new Error('抽象方法不能直接调用！')
	},
	getSpeed: function(){
		throw new Error('抽象方法不能直接调用！')
	}
}

//抽象工厂实现
//兰博基尼子类
var Lamborghini = function(price, speed){
	this.price = price
	this.speed = speed
}
//调用工厂加工子类
AbstractFactory(Lamborghini, 'Car')
//必须重写继承来的抽象方法，否则会出错
Lamborghini.prototype.getPrice = function(){
	console.log(this.price)
	return this.price
}
Lamborghini.prototype.getSpeed = function(){
	console.log(this.speed)
	return this.speed
}
// 实例化兰博基尼对象
var car = new Lamborghini(100, '300km/h')
console.log(car.type)
car.getPrice()
console.log(car instanceof AbstractFactory.Car)