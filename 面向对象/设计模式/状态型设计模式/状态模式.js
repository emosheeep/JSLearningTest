//不涉及dom操作，可以直接在node环境运行

/**
 * 创建超级玛丽状态类
 */
var MarryState = function(){
	//内部状态私有量
	var currentState = {},
		//动作与方法的映射
		states = {
			jump: function(){
				console.log("跳跃")
			},
			shoot: function(){
				console.log("射击")
			},
			run: function(){
				console.log("奔跑")
			},
			squat: function(){
				console.log("下蹲")
			}
		}
	//动作控制类
	var Action = {
		changeState: function(){
			var args = arguments // 通过参数传递状态
			// currentState = {} //重置内部状态，此处重置，添加动作必须一次完成
			if (args.length) {
				for (var i=0; i<args.length; i++){
					// 向内部状态中添加动作，方便执行的时候做判定，为true则执行
					currentState[args[i]] = true
				}
			}
			return this //链式调用
		},
		goes: function(){
			console.log('触发一次动作')
			Object.keys(currentState).forEach(function(item){
				states[item] && states[item]() //如果动作存在就执行动作
			})
			currentState = {} //重置内部状态，此处重置，添加动作可以分步完成，直至执行goes()方法以后
			return this
		}
	}
	
	return {
		add: Action.changeState,
		goes: Action.goes
	}
	
}

var marry = new MarryState()
marry.add("jump", "shoot").goes()
.add("squat","shoot").goes()
.add("jump","run").add("shoot").goes()