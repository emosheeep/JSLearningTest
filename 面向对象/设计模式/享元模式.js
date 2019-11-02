var temp = document.createElement('div')
temp.id = 'container'
temp.style.cssText = 'border: 1px solid red'
document.body.appendChild(temp)


/**
 * 享元模式就是一种缓存策略，将以创建的元素缓存下来，改变其中的内容，当作新的元素
 * 省去了创建元素的花销，本质上是元素的复用
 */
var Flyweight = function(){
	var created = []// 保存已创建的元素
	// 创建一个新闻包装容器
	function create(){
		var dom = document.createElement('div')
		// 将容器插入新闻包装容器中
		document.getElementById('container').appendChild(dom)
		// 缓存下来
		created.push(dom)
		return dom
	}

	return {
		// 获取创建新闻元素方法
		getDiv: function(){
			// 如果已创建的元素小于当前页元素总个数，则继续创建
			if (created.length < 5) {
				return create()
			} else {
				// 获取第一个元素并插到后面，利用循环队列反复使用这五个元素
				var div =  created.shift()
				created.push(div)
				return div
			}
		}
	}
}()
//新闻
var article = [
	'我也算万种风情，实非良人',
	'谁能有幸，错付众生',
	'最先动情的人，剥去利刃，沦为人臣',
	'我爱你苍凉双眼，明月星辰',
	'不远万里，叩入心门',
	'一个孤僻的唇，摘获了你首肯，献上一吻',
	'有谁不是 死而寻生',
	'险些终结 险些长命',
	'睡梦中无数次的自刎',
	'笔下有最淋漓的爱恨',
	'以剜挑这浮生',
	'只写你 衣不染尘',
	'我也算万种风情 实非良人',
	'谁能有幸 错付终身',
	'幻想岁月无声',
	'百年之后 合于一坟',
	'我爱你苍凉双眼 留有余温',
	'荒芜的心 旷野徒奔',
	'你会弹落烟尘 抹去指上灰痕 各自纷呈'
]

var page = 0, //当前页
	num = 5, // 每一页的数量
	len = article.length
//添加五条新闻
for (let i = 0; i < num; i++) {
	if (article[i]){
		Flyweight.getDiv().innerText = article[i]
	}
}

// 翻页按钮
var button = document.createElement('button')
button.innerText = '下一页'
button.onclick = function(){
	if(article.length <= (page+1)*num) return
	var origin = ++page * num//获取页面第一条内容索引
	
	//插入下一页的新闻
	// 这里并没有创建新的元素
	//只是将已有的元素拿来修改并复用
	for (let j = 0; j<num; j++){
		if(article[origin+j]){
			Flyweight.getDiv().innerText = article[origin+j]
		} else {
			Flyweight.getDiv().innerText = ""
		}
	}
}
document.body.appendChild(button)
