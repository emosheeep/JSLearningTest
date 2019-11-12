/**
 * 加载template模块和dom模块
 */

var demo_tpl = `<div id="tag_cloud">
	{% tagCloud.forEach(function(item){ %}
		<a href="#" class="tag_item 
		{% if(item["is_selected"]){ %}
			selected
		{% } %}
		" title="{%=item["title"]%}">{% item["text"] %}</a>
	{% }) %}
</div>`

var data = {
	tagCloud: [
		{is_selected: true, title: "这是一本设计模式书", text: "设计模式"},
		{is_selected: false, title: "这是一本HTML书", text: "HTML"},
		{is_selected: null, title: "这是一本CSS书", text: "CSS"},
		{is_selected: "", title: "这是一本JavaScript书", text: "JavaScript"},
	]
}

F.module(['js/template', 'js/dom'], function(template, dom){
	let str = template('demo_tag', data)
	dom.html("test", str)
})