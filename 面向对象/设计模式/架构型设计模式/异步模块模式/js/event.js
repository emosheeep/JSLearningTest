F.module('./js/event',['./js/dom'], function(dom) {
    return {
        on(id, type, fn) {
            dom.g(id)[`on${type}`] = fn;
        }
    }
});