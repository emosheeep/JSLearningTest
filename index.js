var node = document.querySelector("#p1")
var a = document.getElementsByTagName("a").item(0)
var div = document.querySelector("#box")

var comment = document.createComment("this is a comment!")
document.appendChild(comment)

var nodeText = "<h4 style='color:lightgreen'>这是动态插入的结点</h4>"
node.insertAdjacentHTML("beforebegin", nodeText)

document.addEventListener("readystatechange", function(event){
	if(document.readyState == "interactive" || document.readyState == "complete"){
		console.log("页面加载完毕!")
		document.removeEventListener("readystatechange", arguments.callee)
	}
})

// 页面卸载事件
// window.onbeforeunload = function(event){
// 	var msg = "页面即将卸载"
// 	event.returnValue = msg
// 	return msg
// }

// 表单有效性检测
// console.log(form.password.validity.valueMissing)


/*
 * testform的表单事件
 */
testForm()
function testForm(){
	var form = document.forms["testform"]

	form.password.onkeydown = function(event){
		if(event.keyCode === 13){
			event.target.form.submit.focus()
		}
	}

	form.onsubmit = function(event){
		form.submit.disabled = true;
		alert("已经禁用按钮")
	}

	form.username.onfocus = function(event){
		event.target.select()
		console.log("已选中用户名框全部内容。")
	}
	// form.username.onselect = function(event){
	// 	with(event.target){
	// 		console.log(value.substring(selectionStart, selectionEnd))
	// 	}
	// }
	form.submit.onclick = function(event){
		console.log("表单已提交！")
	}

	form.username.onkeypress = function(event){
		if(!event.ctrlKey && event.charCode > 9 && !/\d/.test(String.fromCharCode(event.charCode))){
			event.preventDefault()
			console.log("屏蔽该按键")
		}
	}

	var newSelectNode = document.createElement("option")
	newSelectNode.innerText = "inserted option"
	newSelectNode.value = "这是被插入的option节点"
	form.select.add(newSelectNode, form.select.options[2])

	form.select.onchange = function(){
		console.log(form.select.value)
	}

	/*
	 * 自定义，为剪切板增添内容
	 */
	form.username.oncopy = function(event){
		with(event){
			event.preventDefault() //阻止默认的剪切板操作

			var selectedText = target.value.substring(target.selectionStart, target.selectionEnd)
			var addText = "\n------这是版权信息！作者是雨凉念秋------"
			var text = selectedText+addText

			clipboardData.setData("text/plain", text)
			console.log("已自定义剪切板")
		}
	}
}

/*
 * contextmenu事件， 可以用来自定义右键菜单
 */
contextmenu()
function contextmenu(){
	var menu = document.querySelector("#myMenu")
	menu.onmousedown = function(event){
		console.log(event.target.textContent)
	}
	
	document.addEventListener("contextmenu", function(event){
		//阻止默认右键菜单
		event.preventDefault()
		
		menu.style.left =  `${event.clientX}px`
		menu.style.top =  `${event.clientY}px`
		menu.style.display = "block"
	})
	document.onclick = function(event){
		menu.style.display = "none"
	}
}

/*
 * 自动切换焦点
 */
focusTab('identity')
function focusTab(formName){
	var identity = document.forms[formName]

	identity.addEventListener("keydown", function(event){
		if (event.keyCode == 8) {
			// 阻止冒泡，防止触发window的backspace，导致回退页面
			event.stopPropagation() 
		}
	}, false)
	
	// 定义节点遍历
	var walkeriterator = document.createTreeWalker(identity, NodeFilter.SHOW_ELEMENT, filter, false)
	function filter(node){
		return node.tagName.toLowerCase() == "input" ? 
				NodeFilter.FILTER_ACCEPT:
				NodeFilter.FILTER_SKIP
	}
	var walker = walkeriterator.nextNode()

	// 定义处理函数
	// 焦点前进函数
	function tabFoward(event){
		var target = event.target
		if (event.keyCode == 8 || target == identity) { return }
		if (target.value.length == target.maxLength) {
			walkeriterator.nextSibling().focus()
		}
	}
	// 焦点后退函数
	function tabBack(event){
		if (event.keyCode != 8) { //监听backspace键
			return
		} else {
			if (event.target.value.length == 0) {
				try {
					walkeriterator.previousSibling().focus()
				} catch (e){
					console.error("请正确填写！")
				}
				
			}
		}

	}

	// 利用事件委托，添加事件给父元素
	identity.addEventListener("keyup", tabFoward, false)
	identity.addEventListener("keydown", tabBack, false)
	// 用fucosin是因为focus事件不冒泡
	identity.addEventListener("focusin", function (event){
		//设置当前遍历对象防止错误
		walkeriterator.currentNode = event.target
	}, false)

	identity.reset.onclick = function(){
		identity.region.focus()
	}
}

/*
 *节点遍历
 */
nodeIter()
function nodeIter(){
	

	// 自定义的NodeFilter对象，只要包含一个acceptNode()方法即可

	// var filter = {
	// 	acceptNode: function(node){
	// 		return node.tagName.toLowerCase() == "button" ? 
	// 			NodeFilter.FILTER_ACCEPT:
	// 			NodeFilter.FILTER_SKIP
	// 	}
	// }

	//或者定义一个类似于acceptNode()方法的方法也ok

	function filter(node){
		return node.tagName.toLowerCase() == "input" ? 
				NodeFilter.FILTER_ACCEPT:
				NodeFilter.FILTER_SKIP
	}

	//利用NodeIterator遍历节点
	//若不指定过滤器传入null，则遍历所有元素（深度优先）
	var nodeiterator = document.createNodeIterator(document, NodeFilter.SHOW_ELEMENT, filter, false)

	//执行节点遍历

	// var nod = nodeiterator.nextNode()
	// while(nod != null){
	// 	console.log(nod)
	// 	nod = nodeiterator.nextNode()
	// }

	//利用TreeWalker对象遍历节点，比NodeIterator高级些，有更多方法可以使用
	//创建方法类似于NodeIterator

	//配合上方的焦点控制
	var walkeriterator = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, filter, false)

	//执行节点遍历

	// var walker = nodeiterator.nextNode()
	// while(walker != null){
	// 	console.log(walker)
	// 	walker = nodeiterator.nextNode()
	// }

}

/*
 * DOM范围操作
 */
doRange()
function doRange(){
	var r1 = document.createRange()

	// 只包含了四个输入框
	var identity = document.forms["identity"]
	r1.setStartBefore(identity.region)
	r1.setEndAfter(identity.other)

	// r1.deleteContents() //删除范围内DOM节点
	// var part = r1.extractContents() //删除并返回范围内DOM节点
	// var part = r1.cloneContents() //克隆范围内节点
	// document.forms["testform"].appendChild(part)
	// r1.insertNode(node) //范围内首部插入节点
	
	//环绕范围插入节点
	var r2 = document.createRange()
	r2.setStart(node.firstChild, 1)
	r2.setEnd(node.firstChild, 4)
	// r2.collapse(true) // 将范围折叠到起点
	var span = document.createElement("span")

	//几种不同的设置css的方式
	//1.利用元素的style属性（本质是一个CSSStyleDeclaration对象）的属性cssText属性
	span.style.cssText = "background-color: red;color: white"
	
	//以这种方式添加的会应用到所有标签，因为相当于直接在css里面写
	// document.styleSheets[1].insertRule("span{background-color: red;color: white}", 0)
	// r2.surroundContents(span)
	r2.surroundContents(document.createElement("mark"))

	// 有必要理一下关系StyleSheet相关对象之间的关系
	// console.log(document.styleSheets[1].cssRules[0].cssText)
	// console.log(span.style.cssText)

	//范围比较
	var result = r1.compareBoundaryPoints(Range.END_TO_START, r2)
	// console.log(result)

	// 垃圾回收
	r1.detach();
	r1 = null;
	r2.detach();
	r2 = null;
}

/*
 * 跨文档消息传递
*/
message()
function message(){
	var iframeWindow = frames["richedit"]
	var allowedSite = "http://127.0.0.1:8848"
	
	//内部消息接收
	// iframeWindow.onmessage = function(event){
	// 	if(event.origin == allowedSite){
	// 		console.log("来自"+event.target.document.title+"的消息："+event.data+"且被内部接收")
	// 		//向来源窗口发送回执
	// 		// event.source.postMessage("内部框架收到并发送回执!", event.origin)
	// 		console.log(event.source == event.target)
	// 	}
	// }
	
	//外部消息接收
	// window.onmessage = function(event){
	// 	if(event.origin == allowedSite){
	// 		console.log("来自"+event.target.document.title+"的消息："+event.data)
	// 		// event.source.postMessage("外部部框架收到!", event.origin)
	// 		console.log(event.source == window)
	// 	}
	// }
	
	var post = null
	iframeWindow.onload = function(){
		post = iframeWindow.document.querySelector("#postmsg")
		post.onclick = function(event){ //内部发送按钮绑定
			iframeWindow.postMessage("这是内部框架发送的消息！", allowedSite)
			console.log("内部已发送")
		}
	}
	window.onload = function(){
		post = document.querySelector("#postmsg")
		post.onclick = function(event){ //外部发送按钮绑定
			window.postMessage("这是外部框架发送的消息！", allowedSite)
			console.log("外部已发送")
		}
	}
	post = null //解引
}

/*
* 原生拖放事件
*/
drag()
function drag(){
	// 全局范围内监听拖放事件,利用冒泡
	window.ondragstart = function(event){
		console.log("开始拖放！事件目标为：")
		console.log(event.target)
		//浏览器会自己调用该方法
		// event.dataTransfer.setData("text", window.getSelection().toString())
	}
	window.ondragend = function(event){
		console.log("拖放结束")
	}
	
	var dragarea = document.querySelector("#dragarea")
	// 重写enter和over事件，将dragarea变成可拖放目标
	dragarea.ondragenter = function(event){
		event.preventDefault()
		event.dataTransfer.dropEffect = "move" //然后你会发现蓝色按钮只有在移动到自定义拖放区域时才显示可放置光标
		console.log("有目标被拖入")
	}
	
	dragarea.ondragover = function(event){
		event.preventDefault()
	}
	dragarea.addEventListener("drop", function (event) {
		console.log("目标拖入成功")
		var span = document.createElement("span")
		span.innerText = event.dataTransfer.getData("Text")
		span.style.cssText = "background-color: #808080; color: white;"
		dragarea.appendChild(span)
		
		/*
		* 还可以通过dom范围来将插入进去的文本进行拖放删除等，很灵活，此处提供想法但不操作
		*/
	})
	
	var btn = document.querySelector("#postmsg")
	
	btn.ondragstart = function(event){
		//给蓝色发送消息按钮指定一副图像当发生拖动时显示在光标下方
		event.dataTransfer.setDragImage(this, 30, 100)
		
		//设置蓝色按钮的移动方式，注意三种方式，移动到自定义拖放区域时候光标都不一样
		// event.dataTransfer.effectAllowed = "copy" // 光标为复制状态
		// event.dataTransfer.effectAllowed = "move" // 光标为剪切状态
		event.dataTransfer.effectAllowed = "link" // 光标为链接状态
	}
	
}

/*
* 历史状态管理
*/
historyState()
function historyState(){
	var btn = document.querySelector("#next")
	var page = document.querySelector("#page")
	var currentPage = 0
	btn.onclick = function(){
		currentPage++
		history.pushState({page: currentPage}, null, `?page=${currentPage}`)
		page.innerText = currentPage
	}
	window.onpopstate = function(event){
		if(event.state){
			page.innerText = event.state.page
		} else {
			// 回到第一页时state值为null
			page.innerText = 0
		}
	}
}

/*
* Ajax
*/
ajax()
function ajax(){
	var post = document.querySelector("#getInfo")
	post.onclick = function(){
		var xhr = new XMLHttpRequest()
		var data = {
			username: "144644",
			password: "123546"
		}
		
		xhr.timeout = 100
		xhr.ontimeout = function(){
			console.error("请求超时")
		}
		
		xhr.onprogress = function(event){
			if (event.lengthComputable) {
				console.log(event)
			}
		}	
		
		xhr.onreadystatechange = function(){
			try{
				if (xhr.readyState == 4){
					if(xhr.status >= 200 && xhr.status < 300 || xhr.status ==304){
						console.log("数据获取成功！内容为："+xhr.responseText)
					} else {
						console.error("数据获取失败！")
					}
				}
			}catch(e){
				//TODO handle the exception
				console.error(e)
			}
		}
		
		xhr.open("GET", "example.txt", true)
		xhr.send(null)
	}
	
	// 使用jsonp完成模拟跨域请求
	// var script = document.createElement("script")
	//让script的src属性等于跨域请求地址即可，注意回调函数必须为全局定义的，不然可能无法调用
	// script.src = "http://localhost:8080/static/jsonp/?callback=handleResponse"
	// document.body.appendChild(script)
	/*
	* 1.客户端访问接口时传递一个本地函数名作为回调函数
	* 2.接口获取参数得知回调函数名称，最后返回一段字符串，
	* 		调用本地函数，并将要返回的数据作为参数传入该回调函数
	* 3.客户端接收到之后构建script元素并插入文档中，相当于调用了该回调函数
	* 后端代码类似于返回一段：
	* 	callbcak({"name":"Danny"})
	* 然后就相当于接收到了数据
	*/
}
//使用jsonp完成模拟跨域请求定义的回调函数
// function handleResponse(response){
// 	console.log(response)
// }

//函数限流(js高级技巧)
limit()
function limit(){
	function method(){
		console.log("函数节流————鼠标进入过！ ")
	}
	// 限流函数
	function limitFunc(fn){
		clearTimeout(limitFunc.tid)
		limitFunc.tid = setTimeout(fn, 1000)
	}
	var btn = document.querySelector("#postmsg")
	
	btn.onmouseenter = function(){
		limitFunc(method)
	}
}


/* 
 *	自定义事件
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


//拖动事件实现的类似原理

/* node.style.position = "absolute"
document.onmousemove = function(event){
	console.log("hh")
	node.style.left = event.clientX + "px"
	node.style.top = event.clientY + "px"
} */

// 拖放界面的是实现方式，使用了模块模式封装（js面向对象.js文件中有示例）
var DragDrop = function(){
	// 记录正在拖动的对象，对象必须是绝对定位的
	var dragging = null
	// 完善拖动功能————设置光标在拖动元素中的位置
	var diffX = 0, diffY = 0
	//添加自定义事件
	var dragdrop = new EventTarget() //创建上面定义的自定义事件对象
	
	function handleEvent(event){
		//获取事件和目标,主要是浏览器兼容问题，此处可忽略
		// some codes
		var target = event.target
		//确定事件类型
		switch(event.type){
			case "mousedown":
				// 通过添加draggable类实现拖动，给元素添加draggable类，然后在此处做出判断
				if(target.className.indexOf("draggable") > -1){
					dragging = target //设置正在拖动的目标
					
					// 设置鼠标在拖动元素中的偏移值，完善用户体验，消除抖动感
					diffX = event.clientX - target.offsetLeft
					diffY = event.clientY - target.offsetTop
					
					//触发自定义事件————dragstart并传入事件对象
					dragdrop.fire({
						type: "dragstart", 
						target: dragging, 
						x: event.clientX,
						y: event.clientY
					})
				}
				break
			
			case "mousemove":
				if (dragging !== null) {
					//指定位置。
					// 设置鼠标在拖动元素中的偏移值，完善用户体验，消除抖动感
					// 注意频繁的DOM操作会使得系统性能下降
					dragging.style.left = (event.clientX - diffX) + "px"
					dragging.style.top = (event.clientY - diffY) + "px"	
					
					//触发自定义事件
					dragdrop.fire({
						type: "drag", 
						target: dragging, 
						x: event.clientX,
						y: event.clientY
					})
				}
				break
			case "mouseup":
				//触发自定义事件
				dragdrop.fire({
					type: "dragend", 
					target: dragging, 
					x: event.clientX,
					y: event.clientY
				})
				
				dragging = null //结束拖动，最后解引
				break
		}
	}
	//返回公共方法，此处使用的模块模式
	/* return {
		//启动
		enable: function (){
			document.addEventListener("mousedown", handleEvent, false)
			document.addEventListener("mousemove", handleEvent, false)
			document.addEventListener("mouseup", handleEvent, false)
		},
		//关闭
		disable: function (){
			document.removeEventListener("mousedown", handleEvent)
			document.removeEventListener("mousemove", handleEvent)
			document.removeEventListener("mouseup", handleEvent)
		}
	} */
	
	//下面使用的是增强的模块模式，创建并增强一个对象，最后返回，使得返回的对象支持了事件
	dragdrop.enable = function(){
		document.addEventListener("mousedown", handleEvent, false)
		document.addEventListener("mousemove", handleEvent, false)
		document.addEventListener("mouseup", handleEvent, false)
	}
	dragdrop.disable = function (){
		document.removeEventListener("mousedown", handleEvent)
		document.removeEventListener("mousemove", handleEvent)
		document.removeEventListener("mouseup", handleEvent)
	}
	
	//返回增强后的拖动对象，使其支持了事件功能
	return dragdrop
}

var dragTest = DragDrop()
dragTest.enable() //开启拖动
dragTest.addHandler("dragstart", function(event){
	console.log("这是自定义事件dragstart，以及自定义event对象：")
	console.log(event)
})


/*
* 离线应用与客户端存储
* 第23章
*/

// 离线检测
isOnline()
function isOnline(){
	var flag = navigator.onLine ? "设备在线" : "设备离线"
	console.log(flag)
	
	window.ononline = function (event) {
		console.log("网络已连接！")
	}
	
	window.onoffline = function(event){
		console.log("网络已断开！")
	}
	
	// 应用缓存
	// console.log(applicationCache)
	
	// 获取cookie
	// console.log(document.cookie)
}

/*
 * web存储机制
*/
webStore()
function webStore(){
	
	// sessionStorage对象，数据只能保存到浏览器关闭，其数据可以跨页面刷新而存在
	// 仅针对会话的小段数据存储，如果需要跨会话存储数据，localStorage或globalStorage会更合适
	
	/* sessionStorage.setItem("name","丹尼")
	sessionStorage.setItem("用户","珍妮")
	console.log(sessionStorage) */
	
	//globalStorage 用户跨会话数据存储，但是有一定的限制
	// 首先要指定那些域可以访问，可以使用方括号标记舒勇属性来实现
	// window.globalStorage[location.host].name = "danny"
	// 有的浏览器不兼容
	
	// localStorage 对象时Storage的实例，一样可以通过属性或是方法读取或者设置值
	// 和gobalStorage一样，如果不清理缓存数据，将会一直保存下去
	// localstorage相当于glbaoStorage[location.host]
	/* console.log(typeof globalStorage) */
	
	/**
	 * storage事件————对storage对象尽心任何修改，都会在文档上触发storage事件
	 * 其event属性有以下属性：
	 * domain：发生变化的存储空间的域名
	 * key：设置或删除的键名
	 * newValue：
	 * oldValue：顾名思义
	 */	
	
	//书上说使用document来侦听，但是我试过之后发现的用window对象才行
	window.addEventListener("storage", function(event){
		console.log("localStorage数据改动！！")
		console.log(event)
	}, false)
	localStorage.setItem("newItem","newValue")
	
	
	
	/**
	 * indexedDB数据库
	 */
	
	var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB
	// 可以附带参数代表版本号，非必须
	var request, request = indexedDB.open("administer") 
	//异步方法
	request.onsuccess = function(event){
		// event.target就是request
		console.log("indexedDB数据库打开/创建成功！")
	}
	request.onerror = function(event){
		console.error("诗剧苦创建/打开失败")
	}
	request.onupgradeneeded = function(event){
		// 数据库版本更新时创建表
		var db = event.target.result
		db.createObjectStore("users", {keyPath: "id",autoIncrement: true})
	}
	
	// 获取表单元素
	var indexForm = document.forms["indexedDB"]
	
	//添加数据按钮
	indexForm.add.onclick = function(event){
		var req = indexedDB.open("administer"),
			user = {
				username: indexForm.username.value,
				age: indexForm.age.value
			}
		
		// 如果值为空则什么也不做
		if(user.username == "" && user.age == ""){
			return
		}
		
		req.onsuccess = function(event){
			var db = event.target.result
			
			//创建事务
			var transaction = db.transaction("users", "readwrite")
			req = transaction.objectStore("users").add(user)
			
			req.onsuccess = function(event){
				console.log("添加成功！")
			}
			req.onerror = function(event){
				console.error("数据插入失败")
			}
			
			transaction.onerror = function(){
				console.error("事务未执行完成")
			}
			transaction.oncomplete = function(){
				console.info("事务完成!")
			}
		}
	}
	
	//查询数据按钮
	indexForm.display.onclick = function(event){
		var req = indexedDB.open("administer")
		
		req.onsuccess = function(event){
			var db = event.target.result
			
			//创建事务
			var transaction = db.transaction("users", "readonly")
			// 游标遍历数据,创建游标
			// 创建游标可传入参数，第一个参数为键范围，第二个参数为游标方向
			// 也可以不传参数
			var store = transaction.objectStore("users"),
				cursorReq = store.openCursor()
			
			cursorReq.onsuccess = function(event){
				var cursor = event.target.result //IDBCursor实例
				if (cursor) { //如果没有下一项则为null
					console.log("Key:"+cursor.key+","+"Value:"+JSON.stringify(cursor.value))
					cursor.continue() //不指定参数则跳转至下一项
				}
			}
			cursorReq.onerror = function(event){
				console.error("查询失败")
			}
			
			transaction.onerror = function(){
				console.error("事务未执行完成")
			}
			transaction.oncomplete = function(){
				console.info("事务完成!")
			}
		}
	}
	
}


/**
 * PageVisibility API，页面是否隐藏
 */
// 检测页面是否可见，页面隐藏状态改变会触发事件
/*document.addEventListener("webkitvisibilitychange", function(){
	console.log(document.webkitHidden)
	console.log(document.visibilityState)
}, false) */

/**
 * Geolocation API，地理位置接口
 */
// 尝试获取地理位置，但是网站好像不能访问
/* navigator.geolocation.getCurrentPosition(function(){
	console.log("位置获取成功")
}, function(error){
	console.error(error.message)
}) */

/**
 * File API，文件接口
 */
//FileReader类型————类似于XMLHttpRequeset，只不过读取的时文件系统而非远程服务器
var filelist = document.querySelector("input[name='file']")
filelist.onchange = function(event){
	var fr = new FileReader(),
		file = event.target.files[0]
	
	fr.readAsText(file)
	fr.onerror = function(){
		console.error("读取失败")
	}
	fr.onprogress = function(event){
		if(event.lengthComputable){
			console.log("读取进度：" + event.loaded + "/" + event.total)
		}
	}
	fr.onload = function(){
		console.log("Contents：" + fr.result)
	}
}

/**
 * 对象URL————图片预览等
 */
previewImg()
function previewImg(){
	//浏览器兼容方法
	var createObjectURL = function(blob){
		if (window.URL){
			return window.URL.createObjectURL(blob)
		} else if (window.webkitURL) {
			return window.webkitURL.createObjectURL(blob)
		} else {
			return null
		}
	}
	
	var filelist = document.querySelector("input[name='pic']")
	filelist.onchange = function(event){
		var fr = new FileReader(),
			file = event.target.files[0],
			url = createObjectURL(file)
			img = document.createElement("img")
		
		img.src = url
		img.style.cssText = "width: 150px; float: right;"
		document.body.insertBefore(img, document.body.childNodes[2])
		console.log("图片插入成功！")
	}
}

/**
 * 结合拖动事件和FileReader接口和XMLHttpRequest对象，可以实现拖动上传
 */


/**
 * Web Workers 使用
 */
/* work()
function work(){
	// webworker.js传入一个数组，计算数字之和
	var worker = new Worker("webworker.js"),
		nums = [1,2,3,4,5,6]
	// 利用worker计算数组的和
	worker.postMessage(nums) //将数据传到worker里面
	worker.onmessage = function(event){
		console.log(event.data)
	}
} */
