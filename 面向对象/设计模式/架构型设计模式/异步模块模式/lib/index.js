(function(F) {
    // 模块缓存器。存储已创建模块
    let moduleCache = {};

    function getUrl(moduleName) {
        // 拼接完整的文件路径字符串，如'lib/ajax' => 'lib/ajax.js'
        return String(moduleName).replace(/\.js$/g, '') + '.js';
    }

    function loadScript(src) {
        let _script = document.createElement('script');
        // 文件类型
        _script.type = 'text/JavaScript';
        // 确认编码
        _script.charset = 'UTF-8';
        // 异步加载
        _script.async = true;
        // 文件路径
        _script.src = src;
        document.getElementsByTagName('head')[0].appendChild(_script);
    }

    /**
     * 异步加载依赖模块所在文件
     * @param moduleName        模块路径（id）
     * @param callback          模块加载完成回调函数
     */
    function loadModule(moduleName, callback) {
        let _module;
        // 如果依赖模块被要求加载过
        if(moduleCache[moduleName]) {
            _module = moduleCache[moduleName];
            // 如果模块加载完成
            if(_module.status === 'loaded') {
                // 执行模块加载完成后回调函数,这里_module.exports就是下面的params[index] = mod中的mod
                setTimeout(callback(_module.exports), 0);
            } else {
                // 缓存该模块所处文件加载完成回调函数
                _module.onload.push(callback);
            }
            // 模块第一次被依赖引用
        } else {
            // 缓存该模块初始化信息
            moduleCache[moduleName] = {
                // 模块ID
                moduleName: moduleName,
                // 模块对应文件加载状态(默认加载中)
                status: 'loading',
                // 模块接口
                exports: null,
                // 模块对应文件加载完成回调函数缓冲器
                onload: [callback]
            };
            // 加载模块对应文件
            loadScript(getUrl(moduleName));
        }
    }

    /**
     * 设置模块并执行模块构造函数
     * @param moduleName        模块ID名称
     * @param params            依赖模块
     * @param callback          模块构造函数
     */
    function setModule(moduleName, params, callback) {
        // 如果模块被调用过
        if(moduleCache[moduleName]) {
            let _module = moduleCache[moduleName];
            // 设置模块已经加载完成
            _module.status = 'loaded';
            // 矫正模块接口
            _module.exports = callback ? callback.apply(_module, params) : null;
            // 执行模块文件加载完成回调函数
			_module.onload.forEach(function(fn){
				fn(_module.exports);
			})
        } else {
            // 模块不存在，未被调用过（匿名模块），则直接执行回调函数
            callback && callback.apply(null, params);
        }
    }

    /**
     * 创建或调用模块方法
     * @param url           模块url
     * @param modDeps       依赖模块
     * @param modCallback   模块主函数
     */
    F.module = function(url, modDeps, modCallback) {
        // 将参数转化为数组
        let args = [].slice.call(arguments);
        // 获取模块构造函数（参数数组中最后一个参数成员）
        let callback = args.pop();
        // 获取依赖模块（紧邻回调函数参数，且数据类型为数组）
		// 一共三个参数，回调函数前面的参数一定是需要加载或定义的依赖模块
		// 如果有第一个参数的话则启用的是函数的定义模块功能
        let deps = (args.length && args[args.length - 1] instanceof Array) ? args.pop() : [];
        // 该模块url（模块ID）
        url = args.length ? args.pop() : null;
        //  依赖模块序列
        let params = [];
        // 未加载的依赖模块数量统计
        let depsCount = 0;
        if(deps.length) {
			deps.forEach(function(item, index){
				// 增加未加载依赖模块数量统计
				depsCount++;
				// 异步加载依赖模块,将依赖信息录入moduleCache中
				loadModule(item, function(mod) {
				    // 依赖模块序列中添加依赖模块数量统一减一
				    depsCount--;
					// 将模块加载后得到的结果按顺序存入params中
					// 其实就是已经加载好的模块
				    params[index] = mod;
				    // 如果依赖模块全部加载
				    if(depsCount === 0) {
				        // 在模块缓存器中矫正该模块，并执行构造函数
						// 激活并执行
				        setModule(url, params, callback);
				    }
				});
			})
            // 无依赖模块，直接执行回调函数
        } else {
            // 在模块缓存器中矫正该模块，并执行构造函数
            setModule(url, [], callback);
			// 如果url不存在则立即执行回调函数
        }
    }
})((function() {
    // 创建模块管理器对象F，并保存在全局作用域中
    return window.F = {};
})());


/**
 * 对于F.module函数
 * 可以定义模块，也可以加载模块
 * 定义模块时单独写一个文件
 * 加载模块需要先定义才行
 */