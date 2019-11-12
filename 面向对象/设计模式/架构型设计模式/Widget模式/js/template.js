/**
 * Widget模式
 * 可以理解为组件模式
 */
// 借用异步模块模式来管理
//注册模板引擎模块
F.module('js/template', function(){
	/**
	 * 模板引擎，处理数据与编译模板入口
	 * @param {Object} str      模板容器id或者模板字符串
	 * @param {Object} data     渲染数据
	 */
	let _TplEngine = function(str, data){
		// 如果渲染数据是数组则遍历数组逐一渲染
		if(Array.isArray(data)){
			let html = ''
			data.forEach(function(item){
				// 模板字符串拼接
				html += _getTpl(str)(item)
			})
			// 返回模板渲染最终结果
			console.log(html)
			return html
		} else {
			// 返回模板渲染结果
			return _getTpl(str)(data)
		}
	},
	/**
	 * 获取模板 
	 * @param {Object} str     模板容器id或者模板字符串
	 */
	_getTpl = function(str){
		// 获取元素
		let fn
		let ele = document.getElementById(str)
		if (ele) {
			// 如果是inpu或者textarea表单元素，则获取该元素的value值
			// 否则获取元素内容
			let html = /^(textarea|input)$/i.test(ele.nodeName)
						? ele.value
						: ele.innerHTML;
			console.log(html)
			fn = _compileTpl(html)
		} else {
			fn = _compileTpl(str)
		}
		return fn
	},
	// 处理模板
	_dealTpl = function(str){
		let _left = "{%", _right = "%}" // 左右分隔符
		str = String(str)
			// 转义标签内的"<",">"
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			// 过滤回车、制表、换行符
			.replace(/[\r\n\t]/g, '')
			// 替换内容
			.replace(new RegExp(_left+'=(.*?)'+_right, 'g'), "',typeof($1)==='undefined'?'': $1,'")
			// 替换左右分隔符
			.replace(new RegExp(_left, 'g'), "');")
			.replace(new RegExp(_right, 'g'), "template_array.push('")
		// 显式转化为字符串
		return str
	},
	// 编译执行
	/**
	 * @param {Object} str 模板数据
	 * 将_dealTql得到的模板字符串编译成最终的模板
	 */
	_compileTpl = function(str){
		let fnbody = `let template_array = [];\n
			let fn = (function(data){\n
			let template_key='';\n
			for(key in data){\n
				template_key+=('var '+key+'=data[\"'+key+'\"];');\n
			}\n
			eval(template_key);\n` +
			"template_array.push('"+_dealTpl(str)+"');\n" +
			`template_key=null;\n
			})(templateData);\n
			fn=null;\n
			
			return template_array.join('');\n
		`
		// 编译函数
		return new Function("templateData", fnbody)
	}
	return _TplEngine
})

