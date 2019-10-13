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

	/*
	 * contextmenu事件， 可以用来自定义右键菜单
	 */
	window.onload = function(){
		var menu = document.querySelector("#myMenu")
		menu.onmousedown = function(event){
			console.log(event.target.textContent)
		}
		
		form.addEventListener("contextmenu", function(event){
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
	//焦点前进函数
	function tabFoward(event){
		var target = event.target
		if (event.keyCode == 8 || target == identity) { return }
		if (target.value.length == target.maxLength) {
			walkeriterator.nextSibling().focus()
		}
	}
	//焦点后退函数
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

	var span = document.createElement("span")

	//几种不同的设置css的方式
	//1.利用元素的style属性（本质是一个CSSStyleDeclaration对象）的属性cssText属性
	span.style.cssText = "background-color: red;color: white"
	// document.styleSheets[1].insertRule("span{background-color: red;color: white}", 0)
	r2.surroundContents(span)

	// 有必要理一下关系StyleSheet相关对象之间的关系
	// console.log(document.styleSheets[1].cssRules[0].cssText)
	// console.log(span.style.cssText)

	// 垃圾回收
	r1.detach();
	r1 = null;
	r2.detach();
	r2 = null;
}