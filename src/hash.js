/**
* @file Hash处理工具
*/
;(function($) {
    'use strict';
    // 如果浏览器原生支持该事件,则退出  
    if ( "onhashchange" in window.document.body ) { return; }

    var location = window.location,
        oldURL = location.href,
        oldHash = location.hash;

    // 每隔100ms检测一下location.hash是否发生变化
    setInterval(function() {
    var newURL = location.href,
        newHash = location.hash;

    // 如果hash发生了变化,且绑定了处理函数...
    if ( newHash !== oldHash && typeof window.onhashchange === "function" ) {
        // execute the handler
        window.onhashchange({
            type: "hashchange",
            oldURL: oldURL,
            newURL: newURL
        });

        oldURL = newURL;
        oldHash = newHash;
        }
    }, 100);

    $.hash = {
        hashCalls: {},  
        /**
         * 获取hash的内容
         * @return {string} URL中的Hash部分
         */
        getStr: function() {
            return location.hash.split('#')[1];   
        },
        /**
         * 设置Hash的内容
         * @param {string} hashStr 要设置的Hash内容
         */
        setStr: function(hashStr) {
            location.hash = '#' + hashStr;
        },
        /**
         * 按Key-Value的方式设置Hash信息，已设置的会被覆盖，空Value的会被删除
         * 
         * @param {string} key   Hash的key
         * @param {string} value Hash的value
         */
        set: function(key, value) {
            var hashObj = this.getObject();
            hashObj[key] = value;
            //删除没有至的hash
            if (!value) {
                delete hashObj[key];
            }
            this.setObject(hashObj);
        },
        /**
         * 按Hash的key获取Hash的内容
         * 
         * @param  {string} key 要获取的Hash的键值
         * @return {string}     键值对应的HASH内容
         */
        get: function(key) {
            return this.getObject()[key];
        },
        /**
         * 获取完整的Hash内容，并应设为对象
         * 
         * @return {Object} Hash的内容部分
         */
        getObject: function() {
            var hashStr = this.getStr();
            var result = {};
            if (hashStr) {
                var para = hashStr.split('&');
                for(var i in para) {
                    var kvs = para[i].split('='),
                        key = kvs[0],
                        value = kvs[1];
                    result[key] = value;
                }
            }
            return result;
        },
        /**
         * 将对象复制给Hash
         * 
         * @param {Object} hashObject 
         */
        setObject: function(hashObject) {
            var ps = [];
            for(var i in hashObject) {
                if (hashObject.hasOwnProperty(i)) {
                    ps.push(i + '=' + hashObject[i]);
                }
            }
            var hashCode = ps.join('&');
            this.setStr(hashCode);
            return this;
        },
        /**
         * 执行hashchange时间的回调函数
         * @private
         */
        _hashCall: function() {
            var calls = this.hashCalls;
            for (var i in calls) {
                if (calls.hasOwnProperty(i)) {
                    this.hashCalls[i]();
                }
            }
        },
        /**
         * 注册hashchange事件的回调函数
         *
         * @param {string} name 监听器名称，用于解绑定
         * @param  {Function} cb 新增的回调函数
         * @return {object}
         */
        onHashChange: function(name, cb) {
            if (typeof cb === 'function') {
                this.hashCalls[name] = cb;
            }
            return this;
        },
        /**
         * 解除已绑定的hashchange事件
         * 
         * @param  {sring} name
         * @return {object} 
         */
        offHashChange: function(name) {
            delete this.hashCalls[name];
            return this;
        }
    };

    //注册hashchange时间的处理函数，通过exp:hashChange函数来新增执行函数
    window.onhashchange = $.proxy($.hash._hashCall, $.hash);
})(jQuery);