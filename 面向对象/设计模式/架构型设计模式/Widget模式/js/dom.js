F.module('js/dom', function() {
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