/**
 * 迭代器模式
 */
var Iterator = function(items, container){
	var container = container || document.getElementById(container) || document,
	items = container.getElementsByTagName(items),
	length = items.length,
	index = 0,
	splice = Array.prototype.splice //缓存数组的原生splice方法
	
	return {
		first: function(){ return items[0] },
		last: function(){ return items[length-1] },
		pre: function(){
			if(--index >= 0){
				return items[index]
			} else {
				index = 0
				return null
			}
		},
		next: function(){
			if(++index < length){
				return items[index]
			} else {
				index = length - 1
				return null
			}
		},
		get: function(num){
			index = num >= 0? num % length : (num+length) % length
			return items[index]
		},
		each: function(fn){
			// var args = splice.call(arguments, 1)
			// 也可以使用for循环来实现，并传入ars参数
			Array.prototype.forEach.call(items, fn)
		}
	}
}

//创建测试元素
var html = `
	<ul>
		<li>1</li>
		<li>2</li>
		<li>3</li>
		<li>4</li>
	</ul>
`,
ul = document.createElement('ul')
ul.innerHTML = html
document.body.appendChild(ul)

var iter = Iterator("li", ul)
console.log(iter.next())
console.log(iter.pre())
console.log(iter.get(-1))
//each方法在有的低版本浏览器中不支持，所以可能某些情况下需要手动定义
iter.each(function(item,index,array){
	console.log(item.innerHTML)
})