/**
 * 解释器模式
 */
var Interpreter = (function(){
	//获取兄弟元素名称
	function getSiblingName(node){
		// 如果存在兄弟元素
		if (node.previousSibling) {
			var name = "", // 返回兄弟元素名称字符串
				count = 1, // 紧邻兄弟元素中相同名称元素个数
				nodeName = node.nodeName,  // 原始节点名称
				sibling = node.previousSibling
			// 如果存在前一个兄弟元素
			while (sibling) {
				// 节点为元素且节点类型与前一个兄弟元素类型相同，且下一个兄弟元素存在
				if (sibling.nodeType == 1 && sibling.nodeType === node.nodeType
					&& sibling.nodeName){
					// 如果当前元素名和前一兄弟元素名称相同
					if (nodeName == sibling.nodeName){
						++count
						name += count
						/* if (sibling == node.parentNode.children[0]){
							// 当遍历到第一个元素时，节点名称后面添加计数值
						} */
					} else {
						// 重置相同的个数
						count = 1
						// 追加新的节点名称
						name += '|' + sibling.nodeName.toUpperCase()
					}
				}
				sibling = sibling.previousSibling
			}
			return name
		} else {
			// 若不存在兄弟元素
			return ""
		}
	}
	/**
	 * node  目标节点
	 * wrap  容器节点
	 */
	return function(node, wrap){
		// 路径数组
		var path = [],
			wrap = wrap || document
		// 如果当前目标等于容器节点
		if (node === wrap){
			if (wrap.nodeType == 1) {
				// 路径数组中输入容器节点名称
				path.push(wrap.nodeName.toUpperCase())
			}
			return path
		}
		// 如果当前节点父节点不等于wrap
		if (node.parentNode != wrap) {
			// 递归
			path = arguments.callee(node.parentNode, wrap)
		}
		// 如果当前节点父元素等于容器节点
		else{
			// 容器节点是元素
			if(wrap.nodeType == 1) {
				path.push(wrap.nodeName.toUpperCase())
			}
		}
		// 获取元素兄弟元素名称统计
		var siblingsName = getSiblingName(node)
		// 如果节点是元素
		if (node.nodeType == 1) {
			// 输入当前元素节点名称及前面兄弟元素名称的统计
			path.push(node.nodeName.toUpperCase() + siblingsName)
		}
		//返回最终路径
		return path
	}
})()

var html = `
	<div id="container">
		<div>
			<ul>
				<li><span id="span1">span1</span></li>
				<li><span id="span2">span2</span></li>
			</ul>
		</div>
	</div>
	<div>
		<div>
			<ul>
				<li><span id="span6">span6</span></li>
				<li><span id="span7">span7</span></li>
			</ul>
		</div>
	</div>
	
`,
div = document.createElement('div')
div.innerHTML = html
document.body.appendChild(div)

var path = Interpreter(document.getElementById("span7"))
console.log(path)

document.onclick = function(event){
	console.log(event.target)
}