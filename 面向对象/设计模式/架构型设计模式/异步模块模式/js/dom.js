F.module('./js/dom', function() {
    return {
        g(id) {
            return document.getElementById(id);
        },
        html(id, html) {
            if(html) {
                this.g(id).innerHTML = html;
            } else {
                return this.g(id).innerHTML;
            }
        }
    }
});

/**
 * 利用another_index.js中的内容
 */
/* F.define('./js/dom', function() {
    return {
        g(id) {
            return document.getElementById(id);
        },
        html(id, html) {
            if(html) {
                this.g(id).innerHTML = html;
            } else {
                return this.g(id).innerHTML;
            }
        }
    }
}); */