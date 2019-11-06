function Inherit(child,parent){
	/* function f(){}
	f.prototype = new parent()
	child.prototype = new f() */
	//上下两种方式完全等效
	child.prototype = Object.create(new parent()) //继承父类属性和方法
	child.prototype.constructor = child //修正子类constructor属性
}
/**
 * 基类，抽象类
 */
var News = function(){
	//由于每个字列都要声明这两个变量，这里把它写到抽象类中简化子类操作
	this.child = [] //当前元素的子元素
	this.element = null //当前元素
}
News.prototype = {
	init: function(){ throw new Error("请重写方法！") },
	add: function(){ throw new Error("请重写方法！") },
	getElement: function(){ throw new Error("请重写方法！") }
}
/**
 * 组合类——容器类——寄生组合式继承
 */
var UL = function(id, parent){
	News.call(this) 
	
	this.id = id
	this.parent = parent
	
	this.init() //初始化方法，创建元素
}
Inherit(UL, News)//继承
UL.prototype.init = function(){
	this.element = document.createElement('ul')
	this.element.id = this.id
	this.element.className = "news-container"
}
UL.prototype.add = function(child){
	//将子节点保存到子元素数组中
	this.child.push(child)
	//dom树中插入子节点
	this.element.appendChild(child.getElement())
	return this //方便链式调用
}
UL.prototype.getElement = function(){ // 获取dom元素
	return this.element
}
UL.prototype.show = function(){
	this.parent.appendChild(this.element)
}
/**
 * 组合类——容器项目类——LI
 */
var LI = function(classname){
	News.call(this) 
	
	this.classname = classname || ''
	
	this.init() //初始化方法，创建元素
}
Inherit(LI, News)//继承
LI.prototype.init = function(){
	this.element = document.createElement('li')
	this.element.className = 'news-item '+this.classname
}
LI.prototype.getElement = function(){ return this.element } // 获取dom元素
LI.prototype.add = function(child){
	//将子节点保存到子元素数组中
	this.child.push(child)
	//dom树中插入子节点
	this.element.appendChild(child.getElement())
	return this //方便链式调用
}

/**
 * 组合类————新闻群组类——div——主要用来将新闻组合在一起，图片，文本链接等
 */
var Group = function(classname){
	News.call(this)
	
	this.classname = classname || ''
	
	this.init()
}
Inherit(Group,News)
Group.prototype.init = function(){
	this.element = document.createElement('div')
	this.element.className = 'news-group '+this.classname
}
Group.prototype.add = function(child){
	//将子节点保存到子元素数组中
	this.child.push(child)
	//dom树中插入子节点
	this.element.appendChild(child.getElement())
	return this //方便链式调用
}
Group.prototype.getElement = function(){ // 获取dom元素
	return this.element
}
/**
 * 成员类---新闻类-------最底层类
 */
//图片新闻类
var ImageNews = function({src, href = "#", classname = ""}){
	News.call(this)
	
	this.src = src
	this.href = href || '#'
	this.classname = classname || ''
	
	this.init()
}
Inherit(ImageNews, News)
ImageNews.prototype.getElement = function(){ return this.element }
ImageNews.prototype.add = function(){//最底层类不需要子元素
	throw new Error("基层不需要子元素")
} 
ImageNews.prototype.init = function(){
	var a = document.createElement('a'),
		img = new Image(20, 13)
	img.src = this.src
	a.href = this.href
	a.appendChild(img)
	a.className = 'image-news '+this.classname
	this.element = a
}
//图标新闻类
var IconNews = function({text = "", href = "#", type = "video"}){
	News.call(this)
	
	this.text = text
	this.href = href
	this.type = type
	
	this.init()
}
Inherit(IconNews, News)
IconNews.prototype.getElement = function(){ return this.element }
IconNews.prototype.add = function(){//最底层类不需要子元素
	throw new Error("基层不需要子元素")
} 
IconNews.prototype.init = function(){
	var a = document.createElement('a')
	a.innerText = this.text
	a.href = this.href
	a.className = 'icon '+this.type
	this.element = a
}
/**
 * 类型新闻类
 */
var TypeNews = function({//利用对象解构赋值传递参数，这样可以不用指定参数顺序
		type = "",
		text = "",
		href = "#",
		position = "left"
	}){
		News.call(this)

		this.type = type
		this.text = text
		this.href = href
		this.position = position
		
		this.init()
}
Inherit(TypeNews,News)
TypeNews.prototype.getElement = function(){ return this.element }
TypeNews.prototype.add = function(){
	throw new Error("基层不需要子元素")
}
TypeNews.prototype.init = function(){
	var a = document.createElement('a')
	a.innerText = this.position == 'left'
					?`【${this.type}】${this.text}`
					:`${this.text}【${this.type}】`
	a.href = this.href
	a.className = 'text'
	this.element = a
}
/**
 * 新闻创建——实例化
 */
var news = new UL("first-container",document.body)
news.add(
	new LI("first-item").add(
		new ImageNews({src:"../test.jpeg"})
	).add(
		new IconNews({
			text: "太阳会从东边升起嘛", 
			type: "video",
			href: "http://www.baidu.com"
		})
	)
).add(
	new LI("second-item").add(
		new Group("conbine-news").add(
			new ImageNews({src:"../test.jpeg"})
		).add(
			new TypeNews({
				type:'MUSIC',
				text:'泰勒又出新歌啦！！',
				href:'http://www.baidu.com'
			})
		)
	)
).show()


/**
 * 利用组合模式创建表单
 */
/**
 * 基类
 */
var Base = function(){
	this.child = [] //对象形式管理组件
	this.element = null //dom树形式管理组件
}
Base.prototype = {
	getElement: function(){ throw new Error("抽象类方法需要重写！") },
	add: function(){ throw new Error("抽象类方法需要重写！") },
	init: function(){ throw new Error("抽象类方法需要重写！") }
}
/**
 * 组合类
 */
//表单类
var Form = function(id, parent ,name = id){ //name默认与id相同
	Base.call(this)
	this.parent = parent
	 //这里没有为实例创建不必要的id和name属性，个人觉得不必要
	 //有需要的话可以加上，我觉得这样代码可能会更加精简
	this.init(id, name) 
}
Inherit(Form,Base)
Form.prototype.getElement = function(){ return this.elememt }
Form.prototype.add = function(child){
	this.child.push(child)
	this.element.appendChild(child.getElement())
	return this //链式调用
}
Form.prototype.init = function(id, name){
	var form = document.createElement('form')
	form.id = id
	form.name = name
	this.element = form 
}
Form.prototype.show = function(){
	this.parent.appendChild(this.element)
}
//群组类
var Group = function(classname = ""){
	Base.call(this)
	this.init(classname)
}
Inherit(Group,Base)//继承基类
//重写方法
Group.prototype.getElement = function(){ return this.element }
Group.prototype.add = function(child){
	this.child.push(child)
	this.element.appendChild(child.getElement())
	return this
}
Group.prototype.init = function(classname){
	this.element = document.createElement('div')
	this.element.classname = classname
}
/**
 * 成员类
 */
var FormInput = function({
	type = 'text',
	name = '',
	value = ''
}){
	Base.call(this)
	this.init(type,name,value)
}
Inherit(FormInput,Base)
FormInput.prototype.add = function(){ throw new Error("最底层类无需add方法") }
FormInput.prototype.getElement = function(){ return this.element }
FormInput.prototype.init = function(type, name, value){
	var input = document.createElement('input')
	input.type = type
	input.name = name
	input.value = value
	this.element = input
}

/**
 * 表单创建实践，还可以写label类等
 */
var form = new Form("submitInfo", document.body)
form.add(
	new Group().add(
		new FormInput({name: 'username', type: 'text'})
	).add(
		new FormInput({ name: 'password', type: 'password'})
	)
).add(
	new Group().add(
		new FormInput({name: 'submit', type: 'submit', value: '提交'})
	).add(
		new FormInput({name: 'reset', type: 'reset', value: '重置'})
	)
).show()

/**
 * 成员类
 */
