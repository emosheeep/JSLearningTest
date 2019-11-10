/**
 * 委托模式
 * 多个对象接收并处理同一请求，他们将请求委托给另一个对象统一处理
 */
// 创建测试元素
var div = document.createElement('div')
div.innerHTML = `
	<button>按钮1</button>
	<button>按钮2</button>
	<button>按钮3</button>
	<button>按钮4</button>
	<button>按钮5</button>
	<button>按钮6</button>
	<button>按钮7</button>
	<button>按钮8</button>
`
document.body.appendChild(div)

div.onclick = function(event){
	console.log(event.target)
}
