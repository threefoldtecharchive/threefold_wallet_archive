export default () => {
        function htmlencode(str) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        }
    
        if (navigator.userAgent.toLowerCase().indexOf("iphone") !== -1) {
            return;
        }
    
        console.log("Adding clipboard hack");
    
        /* JS code */
    
        var webview_copy_value = '';
        var webview_selected_item = {};
        window.addEventListener('click', function () {
            let cbh_menu = document.getElementById('cbh-custom-menu');
            cbh_menu.style.display = 'none';
    
        }, true);
    
        function clamp(num, min, max) {
            return num <= min ? min : num >= max ? max : num;
        }
    
        document.addEventListener('contextmenu', function (evt) {
            webview_selected_item = evt.path[0];
            webview_copy_value = window.getSelection().toString();
            let cbh_menu = document.getElementById('cbh-custom-menu');
    
            const y = clamp(evt.clientY - 60, 0, window.innerHeight)
            const x = clamp(evt.clientX - 75, 0, window.innerWidth - 150)
    
            cbh_menu.style.top = `${y}px`;
            cbh_menu.style.left = `${x}px`;
    
            cbh_menu.style.display = 'block';
            evt.preventDefault();
        }, false);
    
        document.getElementById('webview_copy').onclick = function () {
            window.flutter_inappwebview.callHandler('COPY', webview_copy_value).then(function () {
    
            });
        }
        document.getElementById('webview_paste').onclick = function () {
            window.flutter_inappwebview.callHandler('PASTE', webview_copy_value).then(function (result) {
                webview_selected_item.select();
                document.execCommand("insertHTML", false, htmlencode(webview_selected_item.value + result));
            });
        }
    }
    