(function () {
    var Sunset = window.Sunset = window.Sunset || {};

    Sunset.Wechat = {
        pay: function (payParams) {
            return new Promise(function (resolve, reject) {
                function onBridgeReady() {
                    //当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
                    //公众号支付
                    WeixinJSBridge.invoke('getBrandWCPayRequest', payParams, function (res) {
                        //alert(JSON.stringify(res));
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            resolve(res);
                        } else {
                            reject(false);
                        }
                        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        //因此微信团队建议，当收到ok返回时，向商户后台询问是否收到交易成功的通知，若收到通知，前端展示交易成功的界面；若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前	展示相应的界面。
                    });
                }
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            });
        }
    }

})();