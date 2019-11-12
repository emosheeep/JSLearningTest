F.module('./js/event',['./js/dom'], function(dom) {
    return {
        on(id, type, fn) {
            dom.g(id)[`on${type}`] = fn;
        }
    }
});


/**
 * 利用another_index.js中的内容
 */
/* F.module('./js/dom', function(dom) {
    return F.define('./js/event', function(){
		return {
		    on(id, type, fn) {
		        dom.g(id)[`on${type}`] = fn;
		    }
		}
	})
}); */