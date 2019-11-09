/**
 * 节流模式
 * 重复触发的业务逻辑延迟执行
 */
/**
 * 限流函数
 * @param {Function} fn    该函数不能是匿名函数
 * @param {Object} params  可选参数对象
 */
var throttle = function(fn, params){
	//如果存在节流id则清除计时器
	if (fn.ID) {
		clearTimeout(fn.ID)
		delete fn.ID  // 释放内存
	}
	// 构造参数
	params = {
		context: params && params.context || null,
		args: params && params.args || [],
		delay: params && params.delay || 300
	}
	//设置计时器
	fn.ID = setTimeout(function(){
		fn.apply(params.context, params.args)
	}, params.delay)
}

document.addEventListener('click', function(){
	throttle(console.log, {args:["haha",12], delay: 200})
}, false)

/**
 * 图片的延迟加载
 */
function lazyLoad(id){
	this.container = document.getElementById(id)
	//缓存图片
	this.imgs = this.getImgs()
	//执行逻辑
	this.init()
}
lazyLoad.prototype = {
	// 初始执行逻辑
	init () {
		this.update()  // 加载当前视图图片
		this.bindEvent()  // 绑定事件
	},
	// 获取图片
	getImgs () {
		var arr = [],
			// 获取图片
			imgs = this.container.getElementsByTagName('img')
		// 将获取的图片转化为数组
		for (var item of imgs) {
			arr.push(item)
		}
		return arr
	},
	// 加载图片
	update () {
		// 如果图片加载完成则返回
		if (!this.imgs.length) {
			return
		}
		// 获取图片长度
		var _this = this
		this.imgs.forEach(function(item, index, arr){
			// 如果图片在可视范围内
			if (_this.shouldShow(item)) {
				// 加载图片
				item.src = item.getAttribute("data-src")
				// 清除缓存中对应的图片
				arr.splice(index, 1)
				console.log(item)
				console.log("图片加载")
			}
		})
	},
	// 利用递归获取纵坐标
	pageY (element) {
		// 如果有父元素
		if (element.offsetParent){
			return element.offsetTop + this.pageY(element.offsetParent)
		} else {
			return element.offsetTop
		}
	},
	// 筛选需要加载的图片
	shouldShow (img) {
		// 可视范围顶部高度
		var	scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
			// 可视范围底部高度
			scrollBottom = scrollTop + document.documentElement.clientHeight,
			imgTop = this.pageY(img),
			imgBottom = imgTop + img.offsetHeight
			// 判断在可视范围内
			// 图片上边缘在可视范围内 || 图片下边缘在可视范围内
			if (imgTop > scrollTop && imgTop < scrollBottom
						|| imgBottom > scrollTop && imgBottom < scrollBottom ){
				return true
			}
			return false
	},
	// 绑定事件
	on: (function(){
		if (document.addEventListener) {
			return function (element, type, fn) {
				element.addEventListener(type, fn, false)
			}
		} else if (document.attachEvent) {
			return function (element, type, fn) {
				element.attachEvent('on'+type, fn)
			}
		} else return function (element, type, fn) {
				element['on'+type] = fn
		}
	})(),
	// 监听窗口的resize和scroll事件
	bindEvent () {
		var _this = this
		this.on(window, 'resize', function(){
			// 节流处理更新逻辑
			throttle(_this.update, {context: _this, delay: 100})
		})
		this.on(window, 'scroll', function(){
			// 节流处理更新逻辑
			throttle(_this.update, {context: _this, delay: 100})
		})
	}
}

/**
 * 示例图片
 */
var div = document.createElement('div')
div.innerHTML = `
<div id="img-container">
	<div style="border: 2px solid red; height: 1000px;">
		我是占位的
	</div>
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<div style="border: 2px solid red; height: 1000px;">
		我是占位的
	</div>
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<div style="border: 2px solid red; height: 1000px;">
		我是占位的
	</div>
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<img src="../fail.png" alt="" data-src="../test.jpeg">
	<img src="../fail.png" alt="" data-src="../test.jpeg">
</div>
`
document.body.appendChild(div)

/**
 * 延迟加载示例
 */
new lazyLoad('img-container')

// 还可以应用在统计数据中,当数据量达到一定程度时在发送数据等等