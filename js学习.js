function Parent(...names){
	this.pmsg = "我是父类";
	this.parent = names
}
Parent.prototype.sayName = function(){
	console.log(this.parent)
}

function Child(name,...parentsName){
	//继承属性
	Parent.apply(this, parentsName);
	this.cmsg = "我是子类";
	this.childName = name
}

// 借用构造函数法实现继承
// Child.prototype = new Parent();
// Child.prototype.constructor = Child;
// Child.prototype.sayChildName = function(){
// 	console.log(this.childName);
// }

// 寄生组合式继承
function conbine(childFunc, parentFunc){
	var proto = parentFunc.prototype; //复制父类原型
	//让子类原型的constructor属性指向子类的构造函数，若没有这一步则指向父构造函数
	proto.constructor = childFunc; 
	childFunc.prototype = proto;
}
conbine(Child, Parent);

var instance = new Child("wo","father","mother");
console.log(instance.sayName())

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

//静态私有变量。类似于创建对象的组合方法，原型继承方法和共享属性，对象保存私有变量
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
/*var singleton = function() {
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
console.log(singleton.publicMethod());*/

//增强的单例模式，返回指定类型的单例
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