/**
 * 同步模块模式（SMD模式）
 */
// 定义模块管理器单体对象
var F = (function(){
	// 保存模块信息
	var modules = {}
	return {
		/**
		 * 模块定义方法
		 */
		define: function(str, fn){
			// 解析模块路由
			var route = str.trim().split("."),
				//old 当前模块的祖父模块，parent当前模块的父模块
				old = parent = modules
			// 遍历路由模块并定义每层模块
			route.forEach(function(item){
				if (!parent[item]){
					// 如果modules中没有该模块则声明该模块
					parent[item] = {}
				}
				// 缓存下一层及的祖父模块, 为了添加方法的时候方便
				old = parent
				// 缓存下一级父模块，进入当前模块中，路由继续深入
				parent = parent[item]
			})
			// 如果给定模块方法则定义该模块方法。
			if(fn){
				old[route[route.length-1]] = fn()
			}
			return this
		},
		/**
		 * 创建模块调用方法
		 */
		module: function(...args){
			var fn = args.pop(), // 最后一个参数是回调函数，前面是模块名
				// 获取依赖模块，转为数组形式
				parts = args,
				// 依赖模块列表
				module = [],
				// 模块路由
				route = "",
				// 设置当前模块对象（F）
				parent
			// 遍历依赖模块parts
			parts.forEach(function(item){
				if(typeof item == "string"){
					// 重置parent，从根对象开始
					parent = modules
					// 解析模块路由
					route = item.split('.')
					// 遍历路由层级
					route.forEach(function(route){
						// 重置父模块，向下深入
						parent = parent[route] || false
					})
					module.push(parent)
				} else {
					// 直接加入依赖模块列表中
					module.push(item)
				}
			})
			//执行回调函数
			fn.apply(null, module)
		},
		showModule: function(){
			console.log(modules)
		}
	}
})()



/**
 * 测试代码
 */
document.body.innerHTML = "<div id=container>哈哈</div>"

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
			if(!this.dom){
				throw new Error("请先选择dom元素")
			}
			this.dom.innerHTML = html
			return this
		} else {
			return this.dom.innerHTML
		}
	}
	return $
})
F.define("dom.addClass", function(){
	return function(className){
		if(!this.dom){
			throw new Error("请先选择dom元素")
		}
		if(this.dom.className.indexOf(className)<0){
			this.dom.className += ' ' + className
		}
	}
})

F.module("dom","string.trim", function(dom, trim){
	dom("container").html("通过dom模块设置的内容")
	console.log(trim("        ll         "), 123)
	dom("container").addClass("haha")
})
F.module({name: "不存在该模块则直接将这些参数传入"}, function(args){
	console.log(args)
})

F.showModule()