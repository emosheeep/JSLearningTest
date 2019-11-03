/**
 * @param {Object} 弹框基类
 */
var Alert = function(data){
	if(!data) return
	
	this.content = data.content  //设置内容
	this.panel = document.createElement('div')  //创建提示框面板
	this.contentNode = document.createElement('p')  //创建提示内容组件
	this.confirmBtn = document.createElement('button')  //创建确认按钮组件
	this.cancelBtn = document.createElement('button')  //创建取消按钮
	this.closeBtn = document.createElement('button')  //创建关闭按钮组件
	
	this.panel.className = 'alert'
	this.closeBtn.className = 'a-close'
	this.confirmBtn.className = 'a-confirm'
	this.cancelBtn.className = 'a-cancel'
	
	this.confirmBtn.innerHTML = data.confirm || '确认'
	this.cancelBtn.innerHTML = data.cancel || '确认'
	this.contentNode.innerHTML = this.content
	
	this.success = data.success || function(){} //点击确定按钮执行方法
	this.fail = data.fail || function(){}  //点击取消按钮执行方法
	this.close = data.close || function(){}  //点击关闭按钮执行方法
}
Alert.prototype = {
	init: function(){
		//生成提示框，注意插入顺序
		this.panel.appendChild(this.closeBtn)
		this.panel.appendChild(this.contentNode)
		this.panel.appendChild(this.confirmBtn)
		this.panel.appendChild(this.cancelBtn)
		//插入页面
		document.body.appendChild(this.panel)
		//绑定事件
		this.bindEvent()
		//显示提示框
		this.show()
	},
	bindEvent: function(){
		var _this = this
		this.closeBtn.onclick = function(){
			_this.close() //执行关闭按钮绑定的方法
			_this.hide() //隐藏弹框
		}
		this.confirmBtn.onclick = function(){
			_this.success() //执行确认按钮绑定的方法
			_this.hide() //隐藏弹框
		},
		this.cancelBtn.onclick = function(){
			_this.fail() //执行取消按钮绑定的方法
			_this.hide() //隐藏弹框
		}
	},
	hide: function(){
		this.panel.style.display = 'none'
	},
	show: function(){
		this.panel.style.display = 'block'
	}
}

/**
 * 根据模板来创建类
 */
var TitleAlert = function(data){
	Alert.call(this, data) //继承弹框基类
	
	this.title = data.title 
	this.titleNode = document.createElement('h3')
	this.titleNode.innerHTML = this.title
}
TitleAlert.prototype = Object.create(new Alert())
TitleAlert.prototype.constructor = TitleAlert
//对基类方法进行扩展
TitleAlert.prototype.init = function(){
	this.panel.appendChild(this.titleNode)
	Alert.prototype.init.call(this)  //继承提示框init方法
}
/**
 * 具体实现
 */
var alert = new TitleAlert({
	title: '包围警告！',
	content: '你们被包围了！',
	confirm: '放下武器',
	cancel: '就不放',
	success: function(){
		console.log("好的，我们放下武器！")
	},
	fail: function(){
		console.log("你过来啊！怕你吗！")
	},
	close: function(){
		console.log("弹框已关闭！")
	}
})

alert.init()