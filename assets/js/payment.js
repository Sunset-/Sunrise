(function () {

    var PLATE_PREFIX_ENUM = 'PlateNumberPrefix';
    var INDEX_PAYMENT_REMARK = 'IndexPaymentRemark';

    var DETAIL_INFOS = [{
        label: '车牌号',
        key: 'car_license_number'
    }, {
        label: '订单号',
        key: 'record_number'
    }, {
        label: '开始时间',
        key: 'enter_time'
    }, {
        label: '计费时间',
        key: 'order_submit_time'
    }, {
        label: '停车时长',
        key: 'stopping_time',
        format: function (value) {
            var ms = +value;
            var hours = parseInt(value / 60);
            var m = value % 60;
            return (hours > 0 ? (hours + '小时') : '') + m + '分钟';
        }
    }, {
        label: '停车费用',
        key: 'total_amount'
    }, {
        label: '已缴费用',
        key: 'payment_amout'
    }, {
        label: '应缴费用',
        key: 'current_receivable'
    }]

    var App = {
        plateNumberPrefix: null,
        bizContent: null,
        init: function () {
            this.$inputPage = $('.platenumber-input-wrap');
            this.$detailPage = $('.payment-desc-wrap');
            this.$errorPage = $('.error-wrap');
            this.pages = $('.page');

            this.$plateNumberPrefix = $(".prefix");
            this.$selector = $('.plateNumberPrefixSelector');
            this.$plate = $('.plateNumber');
            this.$detailTable = $('.desc-table');
            this.$errorMsg = $('.error-msg');
            this.initData();
            this.initEvent();
        },
        initData: function () {
            var self = this;
            //字典
            $.ajax({
                url: '/system/dictionaryItem/use/all'
            }).then(function (res) {
                if (res && res.data) {
                    var prefixs = [];
                    for (var i = 0, item; item = res.data[i++];) {
                        if (item.type == PLATE_PREFIX_ENUM) {
                            if (prefixs.length == 0) {
                                self.$plateNumberPrefix.html(item.value);
                                prefixs.push('<span class="active" data-value="' + item.value + '">' + item.value + '</span>');
                                continue;
                            }
                            prefixs.push('<span data-value="' + item.value + '">' + item.value + '</span>');
                        }
                    }
                    $('.plateNumberPrefixSelector').html(prefixs.join(''));
                }
            }).then(function (res) {
                $.ajax({
                    url: '/business/payment/request/account/osyLxsrsQYhWEH9U9LeTDbwruwLI'
                }).then(function (res) {
                    var plateNumber = res && res.data && res.data.lastPlateNumber;
                    if (plateNumber) {
                        var prefix = plateNumber.substring(0, 1),
                            suffix = plateNumber.substring(1);
                        self.$plateNumberPrefix.html(prefix);
                        $(".plateNumberPrefixSelector span").removeClass('active');
                        $("[data-value='" + prefix + "']").addClass('active');
                        self.$plate.val(suffix);
                    }
                });
            });
            //文本
            $.ajax({
                url: '/system/systemVariable/use/all'
            }).then(function (res) {
                if (res && res.data) {
                    for (var i = 0, item; item = res.data[i++];) {
                        if (item.name == INDEX_PAYMENT_REMARK) {
                            $('.indexPaymentRemark').append(item.value);
                            return;
                        }
                    }
                }
            });
        },
        initEvent: function () {
            var self = this;
            this.$selector.on('click', 'span', function () {
                var $this = $(this);
                $this.siblings('span').removeClass('active');
                self.$plateNumberPrefix.html(self.plateNumberPrefix = ($this.addClass('active').html()));
            });
            $('.ensureBtn').on('click', function () {
                self.ensure();
            });
            $('.pay-btn').on('click', function () {
                self.pay();
            });
            $('.prefix').on('click', function () {
                self.$selector.show();
            });
            $(document).on('click', function (ev) {
                var $tgt = ev.target;
                if (!$tgt.closest('.plateNumberInput') || $tgt.closest('.plateNumberInput').length == 0) {
                    self.$selector.hide();
                }
            });
            window.onhashchange = function () {
                var page = window.location.hash.substring(1);
                self.pages.hide();
                if (page) {
                    self['$' + window.location.hash.substring(1) + 'Page'].show();
                } else {
                    self.$inputPage.show();
                }
            }
        },
        ensure: function () {
            var number = this.$plate.val();
            if (this.plateNumberPrefix && number) {
                var plateNumber = this.plateNumberPrefix + number,
                    self = this;
                $.ajax({
                    url: '/business/payment/request/plateNumber',
                    type: 'POST',
                    data: {
                        plateNumber: plateNumber.toUpperCase()
                    }
                }).then(function (res) {
                    if (res && res.data) {
                        var bizContent = res.data;
                        if (bizContent.code == '6C' || bizContent.code == '6E') {
                            self.showDesc(bizContent);
                        } else {
                            self.showError(bizContent.msg);
                        }
                    } else {
                        self.showError(res && res.message || '接口异常');
                    }
                });
            }
        },
        showDesc: function (data) {
            this.bizContent = data;
            var html = [];
            for (var i = 0, item; item = DETAIL_INFOS[i++];) {
                html.push('<div class="info-group"><label>' + item.label + '</label><span>' + (item.format ? (item.format(data[item.key])) : data[item.key]) + '</span></div>')
            }
            this.$detailTable.html(html.join(''));
            this.route('detail');
        },
        showError: function (msg) {
            this.$errorMsg.html(msg);
            this.route('error');
        },
        pay: function () {
            if (this.bizContent) {
                var self = this;
                $.ajax({
                    url: '/business/payment/request/pay',
                    type: 'POST',
                    data: {
                        cacheId: this.bizContent.cacheId,
                        accountId: 'osyLxsrsQYhWEH9U9LeTDbwruwLI'
                    }
                }).then(function (res) {
                    if (res && res.data) {
                        Sunset.Wechat.pay(res.data).then(function (res) {

                        }).catch(function (e) {
                            alert('失败' + e);
                        });
                    } else {
                        self.showError(res && res.message || '接口异常');
                    }
                });
            }
        },
        route: function (page) {
            window.location.hash = page;
        }
    };

    App.init();
})();