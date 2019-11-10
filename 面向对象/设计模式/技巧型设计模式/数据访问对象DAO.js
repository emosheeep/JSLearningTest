/**
 * 数据访问模式
 * 更适合服务端，封装数据库操作
 */

/**
 * @param {Object} preId           本地数据库前缀
 * @param {Object} timeSign        时间戳与存储数据之间的拼接符
 */
var BaseLocalStorage = function(preId, timeSign){
	this.preId = preId
	this.timeSign = timeSign || '|-|'
}
BaseLocalStorage.prototype = {
	// 操作状态
	status: {
		SUCCESS: 0,   // 成功
		FAILURE: 1,   // 失败
		OVERFLOW: 2,  // 溢出
		TIMEOUT: 4    // 超时
	},
	// 保存本地存储链接
	storage: localStorage || window.localStorage,
	// 获取本地存储数据库数据真实字段，即 前缀 + key
	getKey: function (key) {
		return this.preId + key
	},
	/**
	 * @param key        数据字段标识
	 * @param value      数据值
	 * @param callback   回调函数
	 * @param time       添加时间
	 */
	set: function(key, value, callback, time){
		// 默认操作状态成功
		var status = this.status.SUCCESS,
			// 获取真实字段,保存在数据库中的key都是加了前缀的
			key = this.getKey(key)
		try{
			time = new Date(time).getTime() || time.getTime()
		}catch(e){
			// 为传入时间参数或者时间参数有误，获取默认时间一个月，这是数据有效时间
			time = new Date().getTime() + 1000*60*60*24*30
		}
		try{
			// 向数据库中添加数据
			this.storage.setItem(key, time + this.timeSign + value)
		}catch(e){
			// 溢出失败， 返回溢出状态
			status = this.status.OVERFLOW
		}
		// 有回调函数则执行回调函数
		callback && callback(this, status, key, value)
	},
	/**
	 * @param key       数据字段标识
	 * @param callback  回调函数
	 */
	get: function(key, callback){
		var status = this.status.SUCCESS,
			key = this.getKey(key),
			// 默认值是空
			value = null,
			// 时间戳与存储数据之间的拼接字符起始位置
			index,
			// 时间戳
			time,
			//最终数据
			result,
			// 缓存当前对象
			_this = this
		try{
			// 获取字段对应的数据字符串
			value = _this.storage.getItem(key)
		}catch(e){
			// 获取失败则返回状态， 数据结果为null
			result = {
				status: _this.status.FAILURE,
				value: null
			}
			// 执行回调函数并返回
			callback && callback.call(this, result.status, result.value)
			return result
		}
		// 如果成功获取数据
		if (value) {
			// 获取时间戳与存储数据之间拼接符号的起始位置
			index = value.indexOf(_this.timeSign)
			time = +value.slice(0, index)
			//如果时间没有过期
			if (new Date(time).getTime() > new Date().getTime() || time == 0){
				// 获取数据结果 （拼接符后后面的字符串）
				value = value.slice(index + _this.timeSign.length)
				console.log(value)
			} else {
				// 过期则为null
				value = null// 设置为过期状态
				status = _this.status.TIMEOUT
				// 删除该字段
				_this.remove(key)
			}
		} else {
			// 获取数据失败
			status = _this.status.FAILURE
		}
		// 设置结果
		result = {
			status: status,
			value: value
		}
		callback && callback.call(this, result.status, result.value)
		return result
	},
	/**
	 * @param key        数据字段标识
	 * @param callback   回调函数
	 */
	remove: function(key, callback){
		// 默认状态为失败
		var status = this.status.FAILURE,
			key = this.getKey(key),
			value = null
		try{
			value = this.storage.getItem(key)
		}catch(e){}
		
		// 如果数据存在
		if (value) {
			try{
				this.storage.removeItem(key)
				status = this.status.SUCCESS
			}catch(e){}
		}
		// 执行回调函数，如果操作状态成功则返回真实数据，否则返回空
		callback && callback.call(this, status, 
			status>0
			?null
			:value.slice(value.indexOf(this.timeSign) + this.timeSign.length))
	}
}

var store = new BaseLocalStorage("qin","~")
store.set("person1",JSON.stringify({
	name: "雄大",
	age: 20
}))
console.log(store.get("person1"))
/* store.remove("person1", function(status, value){
	console.log(value)
}) */
