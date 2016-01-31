
try {
    var nike = nike || {};
    nike.namespace("nike.Cart");
    nike.requireDependency("nike.Event");
    nike.requireDependency("nike.ServiceUtil");
    nike.requireDependency("jQuery.CookieUtil");
    nike.requireDependency("nike.gadget.Event");
    nike.requireDependency("jQuery");
    nike.requireDependency("jQuery.cookie");
    nike.requireDependency("nike.EventBus");
    nike.requireDependency("nike.ScriptLoader");
    nike.requireDependency("jQuery.xml2json");
    nike.requireDependency("jQuery.cookie");
    nike.ScriptLoader.requireTunnelForUrl(nike.getSecureRootUrl());
    nike.ScriptLoader.requireTunnelForUrl(nike.getRootUrl());
    nike.Cart.CART_SUMMARY_COOKIE = "CART_SUMMARY";
    nike.Cart.MINIMUM_LOGGED_IN_SECURITY_STATUS = 3;
    nike.Cart.NO_SERVICE_WAIT_TIME = 30000;
    nike.Cart.SERVICE_FAILURE_WAIT_TIME = 5000;
    nike.Cart.MAX_NO_SERVICE_RETRIES = 2;
    nike.Cart.MAX_SERVICE_FAILURE_RETRIES = 3;
    nike.Cart.UserType = {
        UNKNOWN: "UNKNOWN",
        DEFAULT_USER: "DEFAULT_USER",
        EMPLOYEE: "EMPLOYEE",
        AFFILIATE: "AFFILIATE"
    };
    nike.Cart.cookieObjectDefaults = {
        profileId: "",
        cartCount: 0,
        userType: nike.Cart.UserType.DEFAULT_USER,
        securityStatus: 0
    };
    nike.Cart.cookieObject = nike.Cart.cookieObjectDefaults;
    nike.Cart.getCartServiceUrl = function(a) {
        return nike.getSecureRootUrl() + a + "/html/services/cartService"
    };
    nike.Cart.getGiftCardBalanceCartServiceUrl = function(a) {
        return nike.getSecureRootUrl() + a + "/html/services/giftCardBalanceCartService"
    };
    nike.Cart.getProductSkuServiceUrl = function(a) {
        return nike.getRootUrl() + a + "/html/services/product/skuService.xml"
    };
    nike.Cart.populateSkus = function(e, b, a) {
        if (!b) {
            nike.error('Gadget "element" must be defined when calling populateSkus')
        } else {
            var d = {
                success: false
            };
            var f = nike.DEFAULT_APP_NAME;
            var c = function(g, i, h) {
                nike.dispatchEvent(nike.Event.POPULATE_SKUS_FAIL, {
                    element: i,
                    response: g,
                    index: a
                })
            };
            nike.request({
                method: "GET",
                url: nike.Cart.getProductSkuServiceUrl(f),
                data: e
            }, function(g) {
                try {
                    d = $.parseJSON(g.data).response
                } catch (h) {
                    d.errorMessages = [h.toString()]
                }
                if (d.success) {
                    nike.dispatchEvent(nike.Event.POPULATE_SKUS_SUCCESS, {
                        element: b,
                        response: d,
                        index: a
                    })
                } else {
                    c(b, d, a)
                }
            }, function(g) {
                d.errorMessages = [g.toString()];
                c(b, d, a)
            })
        }
    };
    nike.Cart.handleSmartCartTimeout = function(b, a) {
        if (b) {
            setTimeout(function() {
                nike.Cart.addToSmartCart()
            }, a + (a / 3))
        } else {
            nike.Cart.addToSmartCart(a)
        }
    };
    nike.Cart.addToSmartCart = function(d, c) {
        var e = $(".smart-cart").data("smartCartInstanceObject");
        var b = e.getRequestData();
        if (c) {
            if (b.pil < 0) {
                b.pil = undefined
            }
            $.extend(b, c)
        }
        $.ajax({
            dataType: "jsonp",
            //https://secure-store.nike.com/ap/services/jcartService?callback=nike_Cart_handleJCartResponse&action=addItem&lang_locale=zh_CN&country=CN&catalogId=4&productId=10264996&price=839&siteId=null&line1=Air+Jordan+Future+Low&line2=%E7%94%B7%E5%AD%A9%E8%BF%90%E5%8A%A8%E7%AB%A5%E9%9E%8B&passcode=null&sizeType=null&skuAndSize=11565093%3A40&qty=1&rt=json&view=3&skuId=11565093&displaySize=40&_=1429435502507
            //
            url: nike.getServiceUrl("jsonCartService"),
            data: b,
            jsonpCallback: "nike_Cart_handleJCartResponse",
            timeout: d || e.retries.noResponse.WAIT_TIME,
            success: $.proxy(function f(g) {
                e.handleResponse(g)
            }),
            error: function a(g) {
                var i = $(".smart-cart").data("smartCartInstanceObject");
                var h = g.statusText == "success";
                if (g.statusText === "timeout" || h) {
                    if (i.smartCartData.isWaiting && i.retries.noResponse.attempt < i.retries.noResponse.MAX_ATTEMPTS) {
                        i.retries.noResponse.attempt++;
                        nike.dispatchEvent(nike.Event.SMART_ADD_TO_CART, {
                            status: "smart cart timeout retry:" + i.retries.noResponse.attempt
                        });
                        nike.Cart.handleSmartCartTimeout(h, i.retries.noResponse.WAIT_TIME)
                    } else {
                        i.smartCartData.isWaiting = false;
                        i.showTimeout()
                    }
                } else {
                    if (i.smartCartData.isWaiting && i.retries.badResponse.attempt < i.retries.badResponse.MAX_ATTEMPTS) {
                        i.retries.badResponse.attempt++;
                        nike.dispatchEvent(nike.Event.SMART_ADD_TO_CART, {
                            status: "smart cart timeout retry:" + i.retries.badResponse.attempt
                        });
                        setTimeout(function() {
                            nike.Cart.addToSmartCart(i.retries.badResponse.WAIT_TIME)
                        }, i.retries.badResponse.RETRY_INTERVAL)
                    } else {
                        i.smartCartData.isWaiting = false;
                        i.showTimeout()
                    }
                }
            }
        })
    };
    nike.Cart.initializeCaptcha = function() {
        var b = nike.exp.script.device_detect.isMobile();
        var c;
        if (!nike.exp.pdp.Captcha) {
            var a = ["nike.exp.pdp.Captcha"];
            nike.requestScripts(a, function d() {
                c = new nike.exp.pdp.Captcha();
                c.getCaptcha({
                    displayType: b ? c.displayTypes.MOBILE : c.displayTypes.DESKTOP
                })
            })
        } else {
            c = new nike.exp.pdp.Captcha();
            c.getCaptcha({
                displayType: b ? c.displayTypes.MOBILE : c.displayTypes.DESKTOP
            })
        }
    };
    window.nike_Cart_handleJCartResponse = function(a) {};
    nike.Cart.setATCButtonState = function(a) {
        $(".js-add-to-cart").attr("disabled", a)
    };
    nike.Cart.addToCart = function(d, e, l, b) {
        nike.Cart.setATCButtonState(true);
        var h;
        var k;
        //d object details; e element uicontext; l&b functions
        var c = function(n) {//after add
            if (n.status === "success") {
                var m = {
                    element: e,
                    response: n,
                    productId: d.productId,
                    requestData: d,
                    trackProduct: k
                };
                if (!nike.Cart.order || n.order.itemQuantity > nike.Cart.order.order.itemQuantity) {
                    setTimeout(function() {
                        nike.dispatchEvent(nike.Event.ADD_TO_CART_SUCCESS, m)
                    }, 300);
                    if (l) {
                        l(m)
                    }
                }
            } else {
                if (n.exceptions[0].errorcode === "notEnoughStockMessage") {
                    setTimeout(function() {
                        nike.dispatchEvent(nike.Event.ADD_TO_CART_SUCCESS, {
                            response: n
                        })
                    }, 300)
                }
                i(n, e)
            }
        };
        var g = function(p) {//phone handling
            var o = $("body").hasClass("Phone");
            if (!nike.exp.pdp.SmartCart) {
                var n = ["nike.exp.pdp.SmartCart"];
                if (o) {
                    n.push("nike.exp.pdp.mobile.SmartCart")
                }
                nike.requestScripts(n, function m() {
                    var r = o ? new nike.exp.pdp.mobile.SmartCart(d) : new nike.exp.pdp.SmartCart(d);
                    r.handleResponse(p)
                })
            } else {
                var q = $(".smart-cart");
                if (q.length > 1) {
                    $(".modal-window-class").has(".smart-cart").remove()
                }
                q = q.data("smartCartInstanceObject");
                if (typeof q === "undefined") {
                    q = o ? new nike.exp.pdp.mobile.SmartCart(d) : new nike.exp.pdp.SmartCart(d)
                } else {
                    q.initSmartCartData();
                    q.setRequestData(d)
                }
                q.handleResponse(p)
            }
        };
        var a = function(n, m) {
            if (m.auth_token && m.server_key && m.status == "solved") {
                f(m)
            }
            nike.unlisten(nike.Event.CAPTCHA_SUCCESSFULLY_SOLVED)
        };
        var j = function() {
            nike.listen(nike.Event.CAPTCHA_SUCCESSFULLY_SOLVED, a);
            nike.Cart.initializeCaptcha()
        };
        var f = function(n) {//json cart service handling
            if (n) {
                $.extend(d, n)
            }
            var m = $.ajax({
                dataType: "jsonp",
                url: nike.getServiceUrl("jsonCartService"),
                jsonpCallback: "nike_Cart_handleJCartResponse",
                data: d,
                timeout: 45000
            });
            m.done(function(o) {
                if (o.status == "captcha") {
                    j()
                } else {
                    if (o.pil) {
                        g(o)
                    } else {
                        c(o)
                    }
                }
            });
            m.fail(function(o) {
                var p = $(".add-to-cart-timeout-modal-content");
                p.removeClass("is-hidden");
                if (!nike.Cart.AddToCartErrorModal) {
                    nike.Cart.AddToCartErrorModal = new nike.exp.global.Modal({
                        $content: p,
                        onClose: function() {
                            p.addClass("is-hidden")
                        }
                    });
                    $(".modal-button-container", p).on("click", ".ok", function() {
                        nike.Cart.AddToCartErrorModal.close()
                    })
                }
                nike.Cart.AddToCartErrorModal.open();
                if (o.statusText == "timeout") {
                    nike.dispatchEvent(nike.Event.ADD_TO_CART_TIMEOUT, {})
                } else {
                    nike.dispatchEvent(nike.Event.ADD_TO_CART_FAIL, {})
                }
            });
            m.always(function() {
                nike.Cart.setATCButtonState(false)
            })
        };
        if (!e) {
            nike.error('Gadget "element" must be defined when calling addToCart')
        } else {
            d.action = "addItem";
            d.rt = "json";
            d.view = 3;
            if (d.skuAndSize) {
                h = d.skuAndSize.split(":");
                d.skuId = h[0];
                if (h[1]) {
                    d.displaySize = h[1]
                }
            }
            k = function() {//product item
                var m = undefined;
                if (d.trackProduct) {
                    m = $.extend({}, true, d.trackProduct);
                    m.qty = d.qty;
                    delete(d.trackProduct)
                } else {
                    m = {
                        productId: d.productId,
                        qty: d.qty,
                        siteId: undefined,
                        price: d.price
                    }
                }
                m.sku = d.skuId;
                return m
            }();
            nike.debug(k);
            nike.dispatchEvent(nike.Event.ADD_TO_CART, {
                data: d,
                element: e,
                trackProduct: k
            });
            var i = function(n, o) { // error handling
                var p = n.exceptions && n.exceptions[0] && n.exceptions[0].errorcode;
                var m = {
                    element: o,
                    errorcode: p,
                    response: n,
                    requestData: d,
                    trackProduct: k
                };
                nike.dispatchEvent(nike.Event.ADD_TO_CART_FAIL, m);
                if (b) {
                    b(m)
                }
            };
            f()
        }
    };
    nike.Cart.addGiftCardToCart = function(d, a) { //doesn't care
        if (!a) {
            nike.error('Gadget "element" must be defined when calling addGiftCardToCart')
        } else {
            var c = {
                success: false
            };
            var e = nike.DEFAULT_APP_NAME;
            d.action = "addConfigurableItem";
            nike.dispatchEvent(nike.Event.ADD_TO_CART, {
                data: d,
                element: a,
                trackProduct: {}
            });

            function b(f, g) {
                nike.dispatchEvent(nike.Event.ADD_TO_CART_FAIL, {
                    element: g,
                    response: f,
                    trackProduct: {}
                })
            }
            nike.request({
                type: "POST",
                url: nike.Cart.getCartServiceUrl(e),
                data: d
            }, function(f) {
                try {
                    c = $.parseJSON(f.data)
                } catch (g) {
                    c.errorMessages = [g.toString()]
                }
                if (c.status === "success") {
                    nike.Cart.order = c;
                    setTimeout(function() {
                        nike.dispatchEvent(nike.Event.ADD_TO_CART_SUCCESS, {
                            element: a,
                            response: c,
                            productId: d.productId,
                            trackProduct: {
                                price: d.price,
                                qty: d.quantity || 1,
                                productId: d.productId,
                                sku: d.skuId
                            }
                        })
                    }, 300)
                } else {
                    b(c, a)
                }
            }, function(f) {
                c.errorMessages = [];
                b(c, a)
            })
        }
    };
    nike.Cart.multiAddToCart = function(f, c) { //dc
        var b, a;
        if (!c) {
            nike.error('Gadget "element" must be defined when calling multiAddToCart')
        } else {
            var e = {
                success: false
            };
            var h = nike.DEFAULT_APP_NAME;
            var g = f.itemList;
            f.itemList = JSON.stringify(f.itemList);
            f.action = "addItems";
            for (b = 0, a = g.length; b < a; b++) {
                g[b].siteId = undefined
            }
            nike.dispatchEvent(nike.Event.ADD_TO_CART, {
                data: f,
                element: c,
                trackProducts: g
            });

            function d(i, j) {
                nike.dispatchEvent(nike.Event.ADD_TO_CART_FAIL, {
                    element: j,
                    response: i
                })
            }
            nike.request({
                type: "POST",
                url: nike.Cart.getCartServiceUrl(h),
                data: f
            }, function(i) {
                try {
                    e = $.parseJSON(i.data)
                } catch (j) {
                    e.errorMessages = [j.toString()]
                }
                if (e.success) {
                    nike.Cart.order = e;
                    nike.dispatchEvent(nike.Event.MULTI_ADD_TO_CART_SUCCESS, {
                        element: c,
                        response: e
                    })
                } else {
                    d(e, c)
                }
            }, function(i) {
                e.errorMessages = [i.toString()];
                d(e, c)
            })
        }
    };
    nike.Cart.formsAddToCart = function(c, b) {
        var d;
        var a;
        var e;
        for (a = 0; a < c.length; a++) {
            e = nike.ServiceUtil.getFormData(c[a]);
            if (!d) {
                d = {
                    itemList: []
                };
                d.siteId = e.siteId;
                d.catalogId = e.catalogId;
                d.lang_locale = e.lang_locale;
                d.country = e.country
            }
            d.itemList.push(e)
        }
        nike.Cart.multiAddToCart(d, b)
    };
    nike.Cart.nikeidAddToCart = function(e, b, a, g) {
        var d = {
            success: false
        };
        var f = "no error code available";
        var h = [];

        function c(i, j) {
            var k = $(".add-to-cart-timeout-modal-content");
            k.removeClass("is-hidden");
            if (!nike.Cart.AddToCartErrorModal) {
                nike.Cart.AddToCartErrorModal = new nike.exp.global.Modal({
                    $content: k,
                    onClose: function() {
                        k.addClass("is-hidden")
                    }
                });
                $(".modal-button-container", k).on("click", ".ok", function() {
                    nike.Cart.AddToCartErrorModal.close()
                })
            }
            if (i.statusText == "timeout") {
                nike.dispatchEvent(nike.Event.ADD_TO_CART_TIMEOUT, {});
                nike.Cart.AddToCartErrorModal.open()
            } else {
                if (nike && nike.id && nike.id.frame && nike.id.frame.PageMessageUtil) {
                    nike.id.frame.PageMessageUtil.postMessage(nike.id.Event.postMessage.ADD_TO_CART_FAIL, i)
                } else {
                    nike.dispatchEvent(nike.Event.ADD_TO_CART_FAIL, {
                        element: j,
                        response: i,
                        code: i.code
                    })
                }
            }
            if (typeof g == "function") {
                g(i)
            }
        }
        nike.request({
            type: "POST",
            url: nike.getServiceUrl("nikeIdAddToCartService"),
            data: e,
            timeout: 45000
        }, function(j) {
            var k = {};
            var n = true;
            try {
                k = $.xml2json(j.data)
            } catch (m) {
                nike.log(m);
                n = false
            }
            if (k.item) {
                if (k.item.length && k.item.length > 0) {
                    for (var l = 0; l < k.item.length && n; l++) {
                        if (n) {
                            n = k.item[l].status === "success"
                        }
                        f = k.item[l].errorCode;
                        h.push(k.item[l].exception)
                    }
                } else {
                    n = k.item.status === "success";
                    f = k.item.errorCode;
                    h.push(k.item.exception)
                }
            } else {
                n = false
            }
            if (n) {
                nike.request({
                    type: "POST",
                    url: nike.Cart.getCartServiceUrl(nike.DEFAULT_APP_NAME),
                    data: {
                        country: nike.COUNTRY,
                        lang_locale: nike.LOCALE
                    }
                }, function(i) {
                    try {
                        d = $.parseJSON(i.data)
                    } catch (o) {
                        d.errorMessages = [o.toString()]
                    }
                    if (d.success) {
                        nike.Cart.order = d;
                        setTimeout(function() {
                            var q = k.itemsAdded ? k.itemsAdded : 0;
                            var p;
                            if (this.data) {
                                p = this.data.skuId
                            }
                            if (nike && nike.id && nike.id.frame && nike.id.frame.PageMessageUtil) {
                                nike.id.frame.PageMessageUtil.postMessage(nike.id.Event.postMessage.ADD_TO_CART_SUCCESS, {
                                    response: d,
                                    isNikeId: b,
                                    qty: q,
                                    sku: p
                                })
                            } else {
                                nike.dispatchEvent(nike.Event.ADD_TO_CART_SUCCESS, {
                                    response: d,
                                    isNikeId: b,
                                    qty: q,
                                    sku: p
                                })
                            }
                            if (typeof a == "function") {
                                a(d)
                            }
                        }, 300)
                    } else {
                        c(d)
                    }
                }, function(i) {
                    c(i)
                })
            } else {
                j.code = f;
                j.exceptions = h;
                c(j)
            }
        }, function(i) {
            if (i.code == undefined) {
                i.code = "no error code available"
            }
            if (i.data.statusText == "timeout") {
                i.statusText = "timeout"
            }
            c(i)
        })
    };
    nike.Cart.updateCartItem = function(a, f, g, b) {
        if (!a) {
            nike.error("appName must be defined when calling updateCartItem")
        } else {
            var e = {
                success: false
            };
            f.action = "updateOrder";
            nike.dispatchEvent(nike.Event.UPDATE_CART_ITEM, {
                data: f
            });

            function d(i) {
                var h = {
                    response: i
                };
                nike.dispatchEvent(nike.Event.UPDATE_CART_ITEM_FAIL, h)
            }

            function c(i) {
                var h = {
                    response: i
                };
                nike.dispatchEvent(nike.Event.UPDATE_CART_ITEM_SUCCESS, h);
                if (g) {
                    g(h)
                }
            }
            nike.request({
                type: "POST",
                url: nike.Cart.getCartServiceUrl(a),
                data: f
            }, function(h) {
                try {
                    e = $.parseJSON(h.data).response
                } catch (i) {
                    e.errorMessages = [i.toString()]
                }
                if (e.success) {
                    c(e)
                } else {
                    d(e)
                }
            }, function(h) {
                e.errorMessages = [h.toString()];
                d(e)
            })
        }
    };
    nike.Cart.checkGiftCardBalance = function(a) {
        if (!a) {
            nike.error("giftCertNumbers must be defined when calling checkGiftCardBalance")
        } else {
            var c = {
                success: false
            };
            var d = {};
            d.action = "checkCertificateBalance";
            d.country = nike.COUNTRY;
            d.lang_locale = nike.LOCALE;
            d.gift_card_numbers = a;
            var e = nike.DEFAULT_APP_NAME;
            nike.dispatchEvent(nike.Event.CHECK_GIFT_CARD_BALANCE, {
                data: d
            });

            function b(g) {
                var f = {
                    response: g
                };
                nike.dispatchEvent(nike.Event.CHECK_GIFT_CARD_BALANCE_FAIL, f)
            }
            nike.request({
                method: "POST",
                url: nike.Cart.getGiftCardBalanceCartServiceUrl(e),
                data: d
            }, function(f) {
                try {
                    c = $.parseJSON(f.data)
                } catch (g) {
                    c.errorMessages = [g.toString()]
                }
                if (c.success) {
                    nike.dispatchEvent(nike.Event.CHECK_GIFT_CARD_BALANCE_SUCCESS, {
                        response: c
                    })
                } else {
                    b(c)
                }
            }, function(f) {
                c.errorMessages = typeof f === "string" ? [f.toString()] : null;
                b(c)
            })
        }
    };
    nike.Cart.loadOrder = function(a, g, b, f) {
        if (!a) {
            nike.error('Missing required parameter "appName" to nike.Cart.loadOrder')
        } else {
            function e(h) {
                nike.dispatchEvent(nike.Event.LOAD_ORDER_SUCCESS, {
                    response: h
                });
                if (g) {
                    g({
                        response: h
                    })
                }
            }

            function d(i) {
                var h = {
                    response: i
                };
                nike.dispatchEvent(nike.Event.LOAD_ORDER_FAIL, h);
                if (b) {
                    b(h)
                }
            }
            if (!f && nike.Cart.order) {
                e(nike.Cart.order)
            } else {
                var c = {
                    success: false
                };
                nike.request({
                    type: "POST",
                    url: nike.Cart.getCartServiceUrl(a),
                    data: {
                        country: nike.COUNTRY,
                        lang_locale: nike.LOCALE
                    }
                }, function(h) {
                    try {
                        c = $.parseJSON(h.data).response
                    } catch (i) {
                        c.errorMessages = [i.toString()]
                    }
                    if (c.success) {
                        nike.Cart.order = c;
                        e(c)
                    } else {
                        d(c)
                    }
                }, function(h) {
                    c.errorMessages = [h.toString()];
                    d(c)
                })
            }
        }
    };
    nike.Cart.clearCartSummary = function() {
        delete nike.Cart.cartSummary;
        nike.Cart.cookieObject = nike.Cart.cookieObjectDefaults;
        $.removeCookie(nike.Cart.CART_SUMMARY_COOKIE, {
            path: "/",
            domain: location.host.match(/nike.*?\.com$/)
        })
    };
    nike.Cart.loadCartSummaryCallbacks = {
        success: $.Callbacks(),
        fail: $.Callbacks()
    };
    nike.Cart.isRequestingLoadCartSummary = false;
    nike.Cart.loadCartSummary = function(l, o, b, k, f) {
        var c;
        var n;
        var e;
        var a = nike.getServiceUrl("jsonCartService");
        var o = o || $.noop;
        var b = b || $.noop;
        if (!l) {
            nike.error('Missing required parameter "appName" to nike.Cart.loadCartSummary')
        } else {
            function m(r) {
                var t;
                var s;
                var q = {
                    response: r
                };
                nike.dispatchEvent(nike.Event.LOAD_CART_SUMMARY_SUCCESS, q);
                if (!nike.Cart.loadCartSummaryCallbacks.success.firing) {
                    nike.Cart.loadCartSummaryCallbacks.success.firing = true;
                    nike.Cart.loadCartSummaryCallbacks.success.fire(q);
                    nike.Cart.loadCartSummaryCallbacks.success.empty();
                    nike.Cart.loadCartSummaryCallbacks.success.firing = false
                }
                if (!nike.Cart.loadCartSummaryCallbacks.fail.firing) {
                    nike.Cart.loadCartSummaryCallbacks.fail.empty()
                }
            }

            function j(q) {
                var i = {
                    response: q
                };
                nike.dispatchEvent(nike.Event.LOAD_CART_SUMMARY_FAIL, i);
                if (!nike.Cart.loadCartSummaryCallbacks.fail.firing) {
                    nike.Cart.loadCartSummaryCallbacks.fail.firing = true;
                    nike.Cart.loadCartSummaryCallbacks.fail.fire(i);
                    nike.Cart.loadCartSummaryCallbacks.fail.empty();
                    nike.Cart.loadCartSummaryCallbacks.fail.firing = false
                }
                if (!nike.Cart.loadCartSummaryCallbacks.success.firing) {
                    nike.Cart.loadCartSummaryCallbacks.success.empty()
                }
            }

            function h() {
                nike.Cart.isRequestingLoadCartSummary = true;
                var i = {
                    url: a,
                    dataType: "jsonp",
                    data: {
                        action: "getCartSummary",
                        rt: "json",
                        country: nike.COUNTRY,
                        lang_locale: nike.LOCALE
                    },
                    success: function(q) {
                        if (q.status === "success") {
                            q.loggedIn = q.securityStatus >= nike.Cart.MINIMUM_LOGGED_IN_SECURITY_STATUS;
                            nike.Cart.cartSummary = q;
                            nike.Cart.setCartSummaryObject();
                            nike.gadget.CartCount.setup($('[data-gadget="nike.gadget.OneNikeNav"]'));
                            nike.dispatchEvent(nike.Event.CART_SUMMARY_REQUEST_SUCCESS, {
                                response: q
                            });
                            m(nike.Cart.cartSummary)
                        } else {
                            j(q)
                        }
                        nike.Cart.isRequestingLoadCartSummary = false
                    },
                    error: function(q) {
                        j(q);
                        nike.Cart.isRequestingLoadCartSummary = false
                    }
                };
                if (a === undefined) {
                    i.error({})
                } else {
                    $.ajax(i)
                }
            }
            var d = function() {
                if (k || !nike.Cart.getCartSummaryExecuted) {
                    h();
                    nike.Cart.getCartSummaryExecuted = true
                }
            };
            e = !nike.Cart.isRequestingLoadCartSummary && (k || !nike.Cart.cartSummary);
            nike.Cart.loadCartSummaryCallbacks.success.add(o);
            nike.Cart.loadCartSummaryCallbacks.fail.add(b);
            if (!k && nike.Cart.cartSummary && !nike.Cart.isRequestingLoadCartSummary) {
                m(nike.Cart.cartSummary)
            } else {
                if (e) {
                    var g = 0;
                    if (f) {
                        d()
                    } else {
                        var p = setInterval(function() {
                            g++;
                            if (!nike.geo || !nike.geo.Locate || ((nike.geo.Locate && nike.geo.Locate.hasCompleted) && (nike.geo.Util && !nike.geo.Util.isRedirecting))) {
                                nike.debug("Nike locate script has finished executing, now safe to make getCartSummary request.");
                                d();
                                clearInterval(p)
                            } else {
                                if (g > 15) {
                                    nike.debug("Nike locate script failed to execute, as such getCartSummary call failed");
                                    clearInterval(p)
                                } else {
                                    nike.debug("Nike locate script has not finished executing, waiting to make getCartSummary request.")
                                }
                            }
                        }, 1000)
                    }
                }
            }
        }
    };
    nike.Cart.getCartSummaryFromCookie = function() {
        if ($.cookie(nike.Cart.CART_SUMMARY_COOKIE)) {
            return $.cookie(nike.Cart.CART_SUMMARY_COOKIE)
        } else {
            return nike.Cart.cookieObject
        }
    };
    nike.Cart.setCartSummaryObject = function() {
        nike.Cart.cookieObject = $.cookie(nike.Cart.CART_SUMMARY_COOKIE)
    };
    nike.Cart.getCartCount = function() {
        var a = nike.Cart.getCartSummaryFromCookie();
        return a.cartCount
    };
    nike.Cart.getUserType = function() {
        var a = nike.Cart.getCartSummaryFromCookie();
        return a.userType
    };
    nike.Cart.getProfileId = function() {
        var a = nike.Cart.getCartSummaryFromCookie();
        return a.profileId
    };
    nike.Cart.setupPricing = function(e, b, i) {
        var f;
        var g;
        var a;
        var c;

        function d(j) {
            return j ? j.replace(/(\.|,)00(\D|$)/, "$2") : ""
        }
        if (!e) {
            nike.error('Gadget "element" must be defined when calling setupPricing')
        } else {
            var h = nike.DEFAULT_APP_NAME;
            c = nike.Cart.getUserType();
            $(e).find("div.prices").each(function() {
                f = $(this);
                g = f.find("div.bulk-pricing");
                a = f.find("span.raw-price");
                var j = f.find("span.overridden"),
                    k = f.find("span.local, div.local");
                switch (c) {
                    case nike.Cart.UserType.EMPLOYEE:
                        if (g.attr("data-bp").length == 0 && g.attr("data-obp").length != 0) {
                            k.html(g.attr("data-obp"));
                            j.html(g.attr("data-bp"))
                        } else {
                            if (i) {
                                k.html('<span class="sale">' + g.attr("data-bp") + "</span>")
                            } else {
                                k.html(g.attr("data-bp"))
                            }
                            var l = (g.attr("data-op") && g.attr("data-op") != "") ? g.attr("data-op") : g.attr("data-obp");
                            j.html(l)
                        }
                        if (a.attr("data-eda") == "true") {
                            a.html(a.attr("data-ep"))
                        }
                        break;
                    case nike.Cart.UserType.AFFILIATE:
                        j.html(g.attr("data-oap"));
                        k.html(g.attr("data-ap"));
                        if (a.attr("data-eda") == "true") {
                            a.html(a.attr("data-ap"))
                        }
                        break;
                    default:
                        break
                }
                if (b) {
                    j.html(d(j.html()));
                    k.html(d(k.html()))
                }
            });
            nike.dispatchEvent(nike.Event.PRICE_SETUP_COMPLETE, {
                element: e
            })
        }
    };
    nike.Cart.updateShippingCountry = function(c, d) {
        var b = nike.DEFAULT_APP_NAME;
        var a = nike.getServiceUrl("jsonCartService");
        nike.log("Posting to " + a + " to update shipping country");
        if (a) {
            nike.request({
                type: "POST",
                url: a,
                data: {
                    country: c.toUpperCase(),
                    lang_locale: d,
                    action: "updateShippingCountry",
                    rt: "json"
                }
            }, function(f) {
                try {
                    responseData = $.parseJSON(f.data)
                } catch (g) {
                    nike.error("Error parsing cart response");
                    nike.error(g)
                }
                if (responseData.status == "success") {
                    nike.dispatchEvent(nike.Event.UPDATE_SHIPPING_COUNTRY_SUCCESS, {
                        response: responseData
                    })
                } else {
                    nike.dispatchEvent(nike.Event.UPDATE_SHIPPING_COUNTRY_FAIL, {
                        response: responseData
                    })
                }
            }, function(e) {
                nike.log("Received failure response message from cart service");
                var f = {};
                f.errorMessages = [e.toString()];
                nike.dispatchEvent(nike.Event.UPDATE_SHIPPING_COUNTRY_FAIL, {
                    response: f
                })
            })
        } else {
            nike.dispatchEvent(nike.Event.UPDATE_SHIPPING_COUNTRY_FAIL)
        }
    };
    nike.Cart.atgMultiAddToCart = function(j, d, a) {
        var l = [],
            g = [],
            e = [],
            h = [],
            b = "action=addItems&lang_locale=" + nike.LOCALE + "&country=" + nike.COUNTRY + "&rt=json&view=3";

        function k(m) {
            var p = 0;
            if (m.shippingGroups && m.shippingGroups.length > 0) {
                for (var o = 0; o < m.shippingGroups.length; o++) {
                    commerceItems = m.shippingGroups[o].commerceItems;
                    if (commerceItems && commerceItems.length > 0) {
                        for (var n = 0; n < commerceItems.length; n++) {
                            p += parseInt(commerceItems[n].quantity)
                        }
                    }
                }
            }
            return p
        }
        nike.SiteIdUtil.getDefaultSiteId(function(i) {
            b += "&siteId=" + i
        });
        for (var c = 0, f = j.length; c < f; c++) {
            b += "&productId=" + j[c].productId;
            b += "&qty=" + j[c].qty;
            b += "&skuId=" + j[c].skuId;
            b += "&displaySize=" + j[c].displaySize
        }
        $.ajax({
            url: nike.getServiceUrl("jsonCartService"),
            dataType: "jsonp",
            data: b,
            timeout: 30000,
            success: function(i) {
                i.totalItemsInCart = k(i.order);
                nike.dispatchEvent(nike.Event.MULTI_ADD_TO_CART_SUCCESS, i);
                d(i)
            },
            error: a
        })
    };
    $.cookie.json = true;
} catch (ex) {
    if (nike.error) {
        nike.error('An unhandled exception was thrown while executing nike.Cart. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
    }
}
