/**
 * 职责链模式，就是分解需求，将一个需求模块化，然后让模块之间协作
 */

/**
 * 第一步————请求模块
 * 异步请求对象
 * 参数 data        请求数据
 * 参数dealType     响应数据处理对象
 * 参数dom          事件源
 */
var sendData = function(data, dealType, dom){
	//XHR对象
	var xhr = new XMLHttpRequest(),
		url = 'http://localhost:3000/getData?mod=userInfo'  // 请求路径
	xhr.onreadystatechange = function(event){
		if(xhr.readyState == 4){
			if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
				dealData(xhr.responseText, dealType, dom)
			}
		}
	}
	xhr.error = function(err){
		console.log(err)
	}
	//拼接字符串
	for (let key in data) {
		url += `&${key}=${data[key]}`
	}

	xhr.open('GET', url, true)
	xhr.send(null)
}
/**
 * 第二步————响应数据适配模块
 * 处理响应数据
 * 参数 data       响应数据
 * 参数 dealType   响应数据处理对象
 * 参数 dom        事件源
 */
var dealData = function(data, dealType, dom){
	// 判断数据类型
	data = JSON.parse(data)
	var dataType = Object.prototype.toString.call(data)
	console.log(dataType)
	switch(dealType){
		// 如果处理方式是提示框
		case 'tips':
			if (dataType == "[object Array]"){
				//创建提示框组件
				return createTips(data, dom)
			}
			if (dataType == "[object Object]"){
				//将响应的对象数据转化为数组
				var newdata = []
				for (let item in data){
					newdata.push(data[item])
				}
				return createTips(newdata, dom)
			}
			//将响应的其他数据转化为数组
			return createTips([data], dom)
			break
		case 'validate':
			//创建校验组件
			return createValidate(data, dom)
			break
		default: 
			throw new Error("处理方式参数错误")
	}
}
/**
 * 终点站————创建提示组件模块
 * 参数 data     响应适配数据
 * 参数 dom      事件源
 */
var createTips = function(data, dom){
	var html = ""
	data.forEach(function(item){
		html += `<li>${item}</li>`
	})
	dom.parentNode.getElementsByTagName('ul')[0].innerHTML = html
}
/**
 * 终点站————创建校验组件模块
 * 参数 data     响应适配数据
 * 参数 dom      事件源
 */
var createValidate = function(data, dom){
	//显示校验结果
	dom.parentNode.getElementsByTagName('p')[0].innerHTML = data
}

/**
 * 最终测试
 */
//先为页面插入测试元素
var input1 = document.createElement('input'),
	input2 = document.createElement('input'),
	span = document.createElement('p'),
	ul = document.createElement('ul')
document.body.appendChild(input1)
document.body.appendChild(input2)
document.body.appendChild(span)
document.body.appendChild(ul)

input1.onchange = function(event){
	sendData({value: this.value}, 'tip', this)
}
input2.onkeydown = function(event){
	sendData({value: this.value}, 'validate', this)
}