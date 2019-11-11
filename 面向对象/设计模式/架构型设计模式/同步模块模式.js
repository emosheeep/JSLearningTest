/**
 * 同步模块模式（SMD模式）
 */
// 定义模块管理器单体对象
// 理论上模块方法应该在闭包中实现，可以隐藏内部信息，这里为了调试方便，直接将方法保存在F上面
var F = {}
F.define = function(str, fn){
	// 解析模块路由
	var parts = str.trim().split("."),
		//old 当前模块的祖父模块，parent当前模块的父模块
		old = parent = this
	// 如果第一个模块是模块管理器单体对象
	// 且屏蔽对define与module模块方法的重写
	if(parts[0] == "F" || parts[0] === "define" || parts[0] === "module"){
		throw new Error("非法操作，不允许直接定义该方法")
	}
	// 遍历路由模块并定义每层模块
	parts.forEach(function(item){
		if (!parent[item]){
			// 声明当前模块
			parent[item] = {}
		}
		// 缓存下一层及的祖父模块, 为了添加方法的时候方便
		old = parent
		// 缓存下一级父模块
		parent = parent[item]
	})
	// 如果给定模块方法则定义该模块方法。
	if(fn){
		old[parts[parts.length-1]] = fn()
	}
	return this
}
F.define("string", function(){
	return {
		trim: function(str){
			return str.replace(/^\s+|\s+$/g, "")
		}
	}
})
F.define("dom", function(){
	var $ = function(selector){
		$.dom = document.getElementById(selector)
		return $
	}
	$.html = function(html){
		if(html){
			this.dom.innerHTML = html
			return this
		} else {
			return this.dom.innerHTML
		}
	}
	return $
})
/**
 * 测试代码
 */
document.body.innerHTML = "<div id=container>哈哈</div>"
F.dom("container").html()

// 模块也可以先声明后创建
F.define("dom.addClass")

F.dom.addClass = function(className){
	console.log(this.dom)
	if(this.dom.className.indexOf(className)<0){
		this.dom.className += ' ' + className
	}
}

F.dom("container").addClass("haha")

console.log(F)

/**
 * 创建模块调用方法
 */
F.module = function(...args){
	var fn = args.pop(), // 最后一个参数是回调函数，前面是模块名
		// 获取依赖模块，如果args[0]不是数组则转为数组
		parts = args,
		// 依赖模块列表
		modules = [],
		// 模块路由
		modIDs = "",
		// 设置当前模块对象（F）
		parent,
		// 保存当前对象
		self = this
	// 遍历依赖模块
	parts.forEach(function(item){
		if(typeof item == "string"){
			// 重置parent
			parent = self
			// 解析模块路由，屏蔽掉父对象F
			modIDs = item.replace(/^F\./, '').split('.')
			// 遍历路由层级
			modIDs.forEach(function(route){
				// 重置父模块，向下深入
				parent = parent[route] || false
			})
			modules.push(parent)
		} else {
			// 直接加入依赖模块列表中
			modules.push(item)
		}
	})
	//执行回调函数
	fn.apply(null, modules)
}

F.module("dom","string.trim", function(dom, trim){
	console.log(dom("container").html())
	console.log(trim("        ll         "), 123)
})