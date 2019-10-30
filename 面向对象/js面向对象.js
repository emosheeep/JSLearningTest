//工厂模式创建对象（过程封装）
/*function Person(name, age){
	var o = new Object()

	o.name = name
	o.age = age
	o.sayname = function(){
		console.log(this.name)
	}

	return o
}
new Person("qinxx", 30).sayname()*/

//构造函数模式创建对象
/*function Person(name, age){
	if (this instanceof Person){
		this.name = name
		this.age = age
		this.sayname = function(){
			console.log(this.name)
		}
	} else {
		return new Person(name, age)
	}
}
//本来是错误的，缺少new操作符会将属性绑定到全局属性
//但此处因为使用了特殊判定，所以结果仍然正确
var p = new Person("qin",40)
p.sayname() // “qin”
*/

// 组合使用构造函数模式和原型模式，前者定义实例属性，后者定义共享属性和方法
/*function Person(name, age){
	this.name = name
	this.age = age
}
Person.prototype.sayname = function(){
	console.log(this.name)
}
Person.money = "100块"
var p = new Person("qin", 10)
p.sayname()
p.money = "10万"
console.log(p.money)*/



//动态原型模式创建对象
/*function Person(name, age){
	this.name = name
	this.age = age

	if (typeof this.sayname != 'function') {
		this.sayname = function(){
			console.log(this.name)
		}
	}
}
var p = new Person("qin", 20)
p.sayname()*/

//寄生构造函数创建对象，可以为一些特殊类型创建额外方法，例如数组。一般情况下不推荐使用
//该方式创建的对象，与直接创建没有什么区别，也和构造函数本身的原型没有什么关系。所以不能通过instanceof判断对象类型
/*function createArray(){
	var values = new Array();

	//添加值
	values.push.apply(values, arguments)

	//添加方法
	values.print = function(){
		console.log(values.join("--"))
	}

	//返回数组
	return values
}
var arr = new createArray(1,2,3,4,5,6)
arr.print()*/

//稳妥构造函数模式，类似于寄生构造函数方式，创建的对象本质上还是Object类的实例
//与直接在函数外部创建没有什么不同，所以依然无法使用instanceof操作符确定类型
/*function Person(name){
	var o = new Object()

	//定义私有变量和函数
	var secret = "只有函数内部方法可以访问我"

	//添加公有方法
	o.sayname = function(){
		console.log(name)
	}
	o.getSecret = function(){
		return secret
	}

	return o
}
var p = Person("qinxuyang")
p.sayname()
console.log(p.getSecret()) //错误*/






/*
* 面向对象之————继承
* 
 */
function Parent(...names){
	this.pmsg = "我是父类";
	this.parent = names
	console.log("父类构造函数被调用")
}
Parent.prototype.sayName = function(){
	console.log(this.parent)
}
function Child(name,...parentsName){
	//继承属性，使用借用构造函数法
	Parent.apply(this, parentsName);
	this.cmsg = "我是子类";
	this.childName = name
}

// 借用组合方式实现继承————借用构造函数实现属性继承，原型链实现方法继承，缺点会调用两次父类构造函数
/*Child.prototype = new Parent();  // 第一次调用父类构造函数
Child.prototype.constructor = Child;
Child.prototype.sayChildName = function(){
	console.log(this.childName);
}
var child = new Child() // 第二次调用父类构造函数
console.log(child.pmsg)*/


// 原型式继承
/*var obj = {
	name: "qinxuyang",
	sayName:function(){
		console.log(this.name)
	},
	friends: ['Lyli']
}
var newObj = Object.create(obj, { // Object.create()复制给定对象，创建一个副本，第二个参数可选，定义了一些新属性。
	age:{
		value: 10
	}
})
newObj.name = "liurunkun"
newObj.friends.push("yimi")
console.log(obj.friends)
console.log(newObj.age)*/

// Object.create()函数的原理
/*function object(obj){
	function f(){}
	f.prototype = obj
	return new f()
}
var p =  object(obj)
console.log(p.friends)*/


// 寄生组合式继承，为解决组合式继承总会调用两次父类构造函数的问题i
/*function conbine(childFunc, parentFunc){
	var proto = Object.create(parentFunc.prototype); //复制父类原型
	//让子类原型的constructor属性指向子类的构造函数，若没有这一步则指向父构造函数
	proto.constructor = childFunc; 
	childFunc.prototype = proto;
}
conbine(Child, Parent);

var instance = new Child("wo","father","mother");
instance.sayName()


Object.keys(Child.prototype).forEach(function(item){
	console.log(item)
})*/




// 私有变量
/*function MyObect(){
	//私有变量和私有函数
	var privateVar = 10;
	function privateFunc(){
		return privateVar;
	}

	//特权方法
	this.publicFun = function(){
		privateVar++;
		return privateFunc();
	}
}
var myObj = new MyObect();
console.log(myObj.publicFun())*/

// 静态私有变量。类似于创建对象的组合方法，原型继承方法和共享属性，对象保存私有变量
/*(function(){
	//私有变量和私有函数(静态)
	var privateVar = 10;
	function privateFunc(){
		return privateVar;
	}

	//构造函数
	MyObect = function(name, age){
		this.name = name;
		this.age = age;
	}

	MyObect.prototype.publicFunc = function(){
		privateVar++;
		return privateFunc();
	}

})()
var myObj = new MyObect("秦旭洋", 20);
var myObj1 = new MyObect("秦", 10);
console.log(myObj.publicFunc())
console.log(myObj1.publicFunc())*/

// 模块模式（为单例创建私有变量和特权方法，前面是为自定义对象类型创建）
var singleton = function() {
    var privateVariable = 10;
    function privateFun() {
        return false;
    }

    return { // 返回的对象字面量中只包含可以公开的属性和方法
        publicProperty: privateVariable,
        publicMethod: function() {
            privateVariable++;
            return privateFun();
        }
    };
}();//实际是一个对象
console.log(singleton.publicMethod());

//增强的模块模式，返回指定类型的单例
/*var singleton = function() {
    var privateVariable = 10;
    function privateFun() {
        return false;
    }

    var object = new Object();

    object.publicMethod = function() {
        privateVariable++;
        return privateFun();
    }
    object.publicProperty =  privateVariable;

    return object
}();

console.log(singleton)*/

