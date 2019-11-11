/**
 * 等待者模式
 * 通过对多个异步进程监听，来触发未来发生的动作
 * 
 * 其实就是同步异步操作，在nodejs中很常用的思想
 * 以下模式在node中是Promise/Deferred模式
 */
var Waiter = function(){
	// 注册的等待对象容器
	var wait = [],
		// 成功回调容器
		doneArr = [],
		// 失败回调容器
		failArr = [],
		self = this
	
	// 监控对象类
	var Promise = function(){
		this.resolved = false
		this.rejected = false
	}
	Promise.prototype = {
		resolve: function(){
			// 设置监控对象为解决成功
			this.resolved = true
			// 监控对象为空则取消执行
			if (wait.length == 0)
				return
			// 遍历注册的对象,反向遍历
			for (var i=wait.length-1; i>=0; i--){
				// 如果监控对象没有被解决或解决失败
				if (!wait[i].resolved || wait[i].rejected) {
					return
				}
				// 清除当前监控对象
				wait.splice(i, 1)
			}
			_exec(doneArr)
		},
		reject: function(){
			this.rejected = true
			if (wait.length == 0)
				return
			wait.splice(0) // 清除所有监控对象
			console.log(wait)
			// 执行失败回调
			_exec(failArr)
		}
	}
	
	// 创建监控对象
	self.Deferred = function(){
		return new Promise()
	}
	
	// 回调执行方法
	function _exec(arr){
		arr.forEach(function(item){
			try{
				// 执行回调函数
				item()
			}catch(e){}
		})
	}
	
	// 监控异步方法，参数为监控对象
	self.when = function(...args){
		wait = args
		// 遍历监控对象
		for (var i=wait.length-1; i>=0; i--){
			// 如果不存在监控对象，或已解决，或不是监控对象
			if(!wait[i] || 
				wait[i].resolved || wait[i].rejected 
				|| !(wait[i] instanceof Promise)){
				wait.splice(i, 1) // 清理内存，清除当前监控对象
			}
		}
		return self
	}
	// 成功回调
	self.done = function(...args){
		doneArr = doneArr.concat(args)
		return self
	}
	// 失败回调
	self.fail = function(...args){
		failArr = failArr.concat(args)
		return self
	}
}

// 创建等待者
var waiter = new Waiter()

var first = function(){
	// 创建监听对象
	var wait = waiter.Deferred()
	setTimeout(function() {
		console.log("第一次请求完成")
		wait.resolve()
	}, 3000);
	// 返回监听对象
	return wait
}()
var second = function(){
	// 创建监听对象
	var wait = waiter.Deferred()
	setTimeout(function() {
		console.log("第二次请求完成")
		wait.resolve()
	}, 5000);
	// 返回监听对象
	return wait
}()

waiter.when(first, second)
.done(function(){
	console.log("请求完成！")
}).fail(function(){
	console.error("请求失败了")
})