/**
 * 简单模板模式
 * 通过格式化字符串拼凑出视图避免创建视图时大量节点操作，优化内存开销
 */
var T = {}
// 主体展示区容器
T.root= document.getElementById("container")
// 创建视图的方法
T.prototype = {
	listPart: function(data){
		var div = document.createElement("div"),  // 模块容器
			ul = "",                            // 列表表字符串
			ldata = data.data.li,               // 列表数据
			// 模块模板
			tpl = A.view(["h2","p","ul"]),
			// 列表项模板
			liTpl = A.formatString(A.view("li"), {li: A.view(['strong', 'span'])})
			// 设置容器id
			data.id && (div.id = data.ID)
			// 遍历列表数据
			for (var i=0, len=ldata.length; i<len; i++) {
				// 如果有列表项数据
				if (ldata[i].em || ldata[i].span) {
					ul += A.formatString(liTpl, ldata[i])
				}
			}
			// 装饰列表数据
			data.data.ul = ul
			// 渲染模块并插入模块中
			div.innerHTML = A.formatString(tql, data.data)
			// 渲染模块
			A.root.appendChild(div)
			
	},
	codePart: function(){},
	onlyTitle: function(){},
	guide: function(){},
}
// 创建视图入口
T.init = function(data){
	// 根据传输的数据进行视图创建
	this.strategy[data.type](data)
}
T.formatString = function(str, data){
	return str.repalce(/\{\{(\w+)\}\}/, function(match, key){
		return data[key] === undefined ? "" : data[key]
	})
}
// 模板生成器, 策略模式
T.view = function(name){
	// 模板库
	var template = {
		// 图片模板
		img: '<img src="{{src}}" alt="{{alt}}" title="{{title}}" />',
		// 带有id和class的模块模板
		part: '<div id="{{id}}" class="{{class}}">{{part}}</div>',
		// 组合模板
		theme: [
			'<div>',
				'<h1>{{title}}</h1>',
				'{{content}}',
			'</div>'
		].join('')
	}
	// 如果参数是一个数组，则返回多行模板
	if (Object.prototype.toString.call(name) === "[object Array]"){
		// 模板缓存
		var tql = ''
		for (var i=0, len=name.length; i<len; i++){
			tql += arguments.callee(name[i])
		}
		return tql
	} else {
		// 如果没有模板则返回简单模板
		return template[name] || (`<${name}>{{${name}}}</${name}>`)
	}
}
