(function(F) {
    // 模块缓存器。存储已创建模块
    let moduleCache = {};

    function getUrl(moduleName) {
        // 拼接完整的文件路径字符串，如'lib/ajax' => 'lib/ajax.js'
        return String(moduleName).replace(/\.js$/g, '') + '.js';
    }

    function loadScript(src, id) {
        let _script = document.createElement('script');
        // 文件类型
        _script.type = 'text/JavaScript';
        // 确认编码
        _script.charset = 'UTF-8';
        // 异步加载
        _script.async = true;
        // 文件路径
        _script.src = src;
        // 文件id
        _script.id = id;
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
                // 执行模块加载完成后回调函数
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
            loadScript(getUrl(moduleName), moduleName);
        }
    }

    /**
     * 设置模块并执行模块构造函数
     * @param moduleName        模块ID名称
     * @param params            依赖模块
     * @param callback          模块构造函数
     */
    function setModule(moduleName, params, callback) {
        let fn;
        // 如果模块被调用过
		console.log(moduleCache)
        if(moduleCache[moduleName]) {
            let _module = moduleCache[moduleName];
            // 设置模块已经加载完成
            _module.status = 'loaded';
            // 矫正模块接口
            _module.exports = callback ? callback.apply(_module, params) : null;
            // 执行模块文件加载完成回调函数
            while(fn = _module.onload.shift()) {
                fn(_module.exports);
            }
        } else {
            // 模块不存在（匿名模块），则直接执行构造函数
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
        let deps = (args.length && args[args.length - 1] instanceof Array) ? args.pop() : [];
        // 该模块url（模块ID）
        url = args.length ? args.pop() : null;
        //  依赖模块序列
        let params = [];
        // 未加载的依赖模块数量统计
        let depsCount = 0;
        // 依赖模块序列中索引值
        let i = 0;
        // 依赖模块序列长度
        let len;

        if(len = deps.length) {
            while(i < len) {
                (function(i) {
                    // 增加未加载依赖模块数量统计
                    depsCount++;
                    // 异步加载依赖模块
                    loadModule(deps[i], function(mod) {
                        // 依赖模块序列中添加依赖模块数量统一减一
                        depsCount--;
                        params[i] = mod;
                        // 如果依赖模块全部加载
                        if(depsCount === 0) {
                            // 在模块缓存器中矫正该模块，并执行构造函数
                            setModule(url, params, callback);
                        }
                    });
                })(i);
                // 遍历下一个模块
                i++;
            }
            // 无依赖模块，直接执行回调函数
        } else {
            // 在模块缓存器中矫正该模块，并执行构造函数
            setModule(url, [], callback);
        }
    }
})((function() {
    // 创建模块管理器对象F，并保存在全局作用域中
    return window.F = {};
})());