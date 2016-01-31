
! function e(t, n, i) {
    function r(a, s) {
        if (!n[a]) {
            if (!t[a]) {
                var c = "function" == typeof require && require;
                if (!s && c) return c(a, !0);
                if (o) return o(a, !0);
                var u = new Error("Cannot find module '" + a + "'");
                throw u.code = "MODULE_NOT_FOUND", u
            }
            var d = n[a] = {
                exports: {}
            };
            t[a][0].call(d.exports, function(e) {
                var n = t[a][1][e];
                return r(n ? n : e)
            }, d, d.exports, e, t, n, i)
        }
        return n[a].exports
    }
    for (var o = "function" == typeof require && require, a = 0; a < i.length; a++) r(i[a]);
    return r
}({
    1: [function(e, t) {
        (function(n) {
            var i = e("./events/manifest.js"),
                r = e("./util/util_environmentCheck.js"),
                o = e("./util/util_returnNestedProperty.js"),
                a = e("./vendor/util_jquery.xdomainrequest.min.js"),
                s = (e("./vendor/util_cookies.js"), e("./stubs/_omit.js")),
                c = e("./stubs/_negate.js"),
                u = e("./stubs/_lodash.js"),
                d = e("../config/run.js");
            a(),
                function(t) {
                    "use strict";
                    d.globalObjectName in t || (t[d.globalObjectName] = {});
                    var n = t[d.globalObjectName];
                    n.config = d, n.events = i;
                    var a, l = [r(d), t.JSON && t.JSON.stringify, t.localStorage];
                    n.dreamsConstructor = function() {
                        if (n.dreamsConstructor.prototype._singletonInstance) return n.dreamsConstructor.prototype._singletonInstance;
                        n.dreamsConstructor.prototype._singletonInstance = a = this, $(t).bind("beforeunload", a.purgePendingEvents);
                        var e = o("nike.dat.utils.getPageID");
                        a.currentPage = e ? e() : "unknown_page", a.registerEvent({
                            name: "dream_for_catching",
                            batch: !0,
                            fields: 1
                        }), a.checkStubs(), t.sessionStorage.getItem("dreams_test") || (a.initializeGuids(), a.initializeEvents())
                    }, n.dreamsConstructor.prototype = {
                        eventQueue: [],
                        logBatch: function(e) {
                            a.eventQueue.push(e), a.eventQueue.length >= d.eventQueueLength && (a.sendPost(a.readyPayload(a.eventQueue)), a.eventQueue = [])
                        },
                        checkStubs: function() {
                            u.negate || (u.negate = c(u)), u.omit || (u.omit = s(u))
                        },
                        initializeEvents: function(e) {
                            var t = e || i;
                            u.each(t, function(e) {
                                "function" == typeof e ? e(a) : e.event(a)
                            })
                        },
                        initializeGuids: function(t) {
                            var n = t || e("../config/guids.js"),
                                i = e("./util/util_guids.js");
                            for (var r in n) {
                                var o = i(n[r]);
                                o.init(), this.config.guids = this.config.guids || {}, this.config.guids[o.config.name] = o
                            }
                        },
                        logNow: function(e) {
                            a.sendPost(a.readyPayload([e]))
                        },
                        readyPayload: function(e) {
                            return {
                                events: e,
                                g: a.getGuid(),
                                t: a.getTime(),
                                vID: d.version
                            }
                        },
                        sendPost: function(e, t) {
                            var n = u.extend({
                                url: a.config.endpoint,
                                type: "POST",
                                data: JSON.stringify(e),
                                success: a.sendStoredEvents,
                                dreamcatcher: !0,
                                contentType: "text/plain"
                            }, t);
                            return $.ajax(n).fail(u.bind(a.sendFail, a, e.events))
                        },
                        sendFail: function(e) {
                            a.recordError({
                                message: "Error with transport"
                            }, !0), a.addToStorage(e)
                        },
                        sendStoredEvents: function() {
                            var e = a.getStorage();
                            e && a.sendPost(a.readyPayload(e), {
                                success: a.emptyStorage
                            })
                        },
                        addToStorage: function(e) {
                            var t = a.getStorage() || [];
                            a.setStorage(t.concat(e))
                        },
                        getStorage: function() {
                            return JSON.parse(t.localStorage.getItem(d.storageIdentifier))
                        },
                        emptyStorage: function() {
                            t.localStorage.removeItem(d.storageIdentifier)
                        },
                        setStorage: function(e) {
                            try {
                                t.localStorage.setItem(d.storageIdentifier, JSON.stringify(e))
                            } catch (n) {
                                a.emptyStorage(), a.recordError(n)
                            }
                        },
                        recordError: function(e, t) {
                            var n = {
                                name: "dreamcatcher_error",
                                code: e.code,
                                message: e.message || e.name,
                                t: a.getTime()
                            };
                            nike && nike.error && nike.error("dreamcatcher: ", n.message), t ? a.addToStorage([n]) : a.logNow(n)
                        },
                        purgePendingEvents: function() {
                            a.eventQueue.length && a.sendPost(a.readyPayload(a.eventQueue))
                        },
                        mapFields: function(e, n) {
                            var i = {};
                            return "object" == typeof n ? u.each(n, function(n, r) {
                                i[r] = o(n, e) || t[n]
                            }) : 1 === n && e && (i = e), i
                        },
                        registerEvent: function(e) {
                            e.batch = e.batch === !1 ? !1 : !0, e.fields = e.fields || null, $(t).bind(e.name, e, a.catchEvent)
                        },
                        catchEvent: function(t, n) {
                            var i = a.mapFields(u.omit(n, "eventName"), t.data.fields);
                            t.data.addUrl && (i.url = e("./util/util_provideFilteredUrl.js")()), i.name = n.eventName || t.data.name, i.t = a.getTime(), t.data.batch ? a.logBatch(i) : a.logNow(i)
                        },
                        registerSeries: function(e) {
                            u.each(e, function(e, t) {
                                e.enable && a.registerEvent($.extend(e, {
                                    name: t
                                }))
                            })
                        },
                        registerPage: function(e, t, n) {
                            a.currentPage === e && a.nodOff("dream_for_catching", $.extend(t(), {
                                eventName: n || "view_" + e
                            }))
                        },
                        nodOff: function(e, t) {
                            $(window).trigger(e, t)
                        },
                        getTime: function() {
                            return (new Date).getTime()
                        },
                        getGuid: function() {
                            return a.config.guids && a.config.guids.guidS ? a.config.guids.guidS.get() : void 0
                        },
                        config: d
                    }, u.all(l, u.identity) && (n.instance = new n.dreamsConstructor)
                }(window), t.exports = n[d.globalObjectName]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
        "../config/guids.js": 27,
        "../config/run.js": 28,
        "./events/manifest.js": 6,
        "./stubs/_lodash.js": 16,
        "./stubs/_negate.js": 17,
        "./stubs/_omit.js": 18,
        "./util/util_environmentCheck.js": 19,
        "./util/util_guids.js": 20,
        "./util/util_provideFilteredUrl.js": 23,
        "./util/util_returnNestedProperty.js": 24,
        "./vendor/util_cookies.js": 25,
        "./vendor/util_jquery.xdomainrequest.min.js": 26
    }],
    2: [function(e, t) {
        t.exports = function(e) {
            this.eventMap = {
                failedProfileCall: {
                    enable: !0
                },
                registerFailEvent: {
                    enable: !0
                },
                loginFailEvent: {
                    enable: !0
                },
                onenikeProfileApiFailed: {
                    enable: !0
                },
                sessionTimeoutEvent: {
                    enable: !0
                },
                passwordResetFailed: {
                    enable: !0
                },
                accessCodeFailure: {
                    enable: !0
                },
                accessCodeError: {
                    enable: !0
                },
                addToCartFailEvent: {
                    enable: !0
                },
                addToCartTimeoutEvent: {
                    enable: !0
                },
                siteFurnitureError: {
                    enable: !0,
                    fields: 1,
                    addUrl: !0
                }
            }, e.registerSeries(this.eventMap)
        }
    }, {}],
    3: [function(e, t) {
        t.exports = function(e) {
            this.eventMap = {
                addToCartEvent: {
                    enable: !0,
                    fields: {
                        pid: "data.productId",
                        qty: "data.qty",
                        skuAndSize: "data.skuAndSize"
                    }
                },
                addToCartSuccessEvent: {
                    enable: !0
                },
                facetNavChangedEvent: {
                    enable: !0,
                    fields: {
                        name: "facetName",
                        value: "facetValueName",
                        newUrl: "query",
                        removeFacet: "removeFacet"
                    }
                },
                facetNavRemovedEvent: {
                    enable: !0,
                    fields: {
                        name: "facetName",
                        value: "facetValueName",
                        newUrl: "query",
                        removeFacet: "removeFacet"
                    }
                },
                changeColorEvent: {
                    enable: !0,
                    fields: {
                        productId: "productId",
                        url: "newUrl"
                    }
                },
                loginAttemptEvent: {
                    enable: !0
                },
                loginStateUpdated: {
                    enable: !0
                }
            }, e.registerSeries(this.eventMap)
        }
    }, {}],
    4: [function(e, t) {
        var n = e("../../util/util_returnNestedProperty.js"),
            i = e("../../stubs/_lodash.js");
        t.exports = {
            event: function(e) {
                if (window.performance) {
                    e.registerEvent({
                        name: "dreamcatcher.rum",
                        batch: !1,
                        fields: 1
                    });
                    var t = this;
                    t.utils.dc = e, $(window).bind("load", function() {
                        setTimeout(i.bind(t.utils.sendEvent, t.utils), 0)
                    })
                }
            },
            utils: {
                sendEvent: function() {
                    this.dc.nodOff("dreamcatcher.rum", {
                        eventName: "rum",
                        url: document.location.href,
                        timing: this.timingMetrics(),
                        thirdPartyAudit: this.thirdPartyAudit(),
                        userTiming: this.userTimingEvents()
                    })
                },
                thirdPartyAudit: function() {
                    return window.performance.getEntriesByType ? i.filter(window.performance.getEntriesByType("resource"), function(e) {
                        var t = e.name.split("/");
                        return t[2] && !~t[2].indexOf("nike") ? !0 : void 0
                    }) : void 0
                },
                userTimingEvents: function(e) {
                    if (window.performance.getEntriesByType) {
                        var t = e || ["loginSetupCompleteEvent", "nike.Event.TRACKING_USER_DATA_UPDATED"];
                        return i.filter(performance.getEntriesByType("mark"), function(e) {
                            var n = !1;
                            return i.each(t, function(t) {
                                return t === e.name ? (n = !0, !1) : void 0
                            }), n
                        })
                    }
                },
                timingMetrics: function() {
                    return window.performance.timing ? {
                        navigationStart: n("performance.timing.navigationStart"),
                        domComplete: n("performance.timing.domComplete"),
                        domInteractive: n("performance.timing.domInteractive"),
                        loadEventStart: n("performance.timing.loadEventStart"),
                        loadEventEnd: n("performance.timing.loadEventEnd"),
                        domLoading: n("performance.timing.domLoading")
                    } : void 0
                }
            }
        }
    }, {
        "../../stubs/_lodash.js": 16,
        "../../util/util_returnNestedProperty.js": 24
    }],
    5: [function(e, t) {
        var n = e("../../vendor/util_cookies.js"),
            i = e("../../stubs/_lodash.js");
        t.exports = {
            event: function(e) {
                var t;
                this.utils.dc = e, n.get("dreams_session") || (n.get("geoloc") && (t = this.utils.parseGeoData(n.get("geoloc"))), e.nodOff("dream_for_catching", {
                    eventName: "dreams_session",
                    geoloc: t,
                    guidU: n.get("guidU")
                }), this.utils.writeSessionCookie())
            },
            utils: {
                writeSessionCookie: function() {
                    n.set("dreams", null, {
                        expires: -1
                    });
                    var e = {
                        expires: 0,
                        domain: ".nike.com",
                        path: "/"
                    };
                    n.set("dreams_session", "catching-dreams", e)
                },
                parseGeoData: function(e) {
                    return i.reduce(e.split(","), function(e, t) {
                        return e[t.split("=")[0]] = t.split("=")[1], e
                    }, {})
                }
            }
        }
    }, {
        "../../stubs/_lodash.js": 16,
        "../../vendor/util_cookies.js": 25
    }],
    6: [function(e, t) {
        var n = [];
        n.push(e("./edf/errors.js")), n.push(e("./edf/tesla.js")), n.push(e("./global/rum.js")), n.push(e("./global/session.js")), n.push(e("./nikeID/nikeid_builder_rum.js")), n.push(e("./ocp/ocp_data.js")), n.push(e("./ocp/ocp_errors.js")), n.push(e("./ocp/ocp_submitOrder.js")), n.push(e("./pages/pageView.js")), n.push(e("./pages/view_cart.js")), n.push(e("./pages/view_confirmation.js")), n.push(e("./pages/view_pdp.js")), n.push(e("./pages/view_product_wall.js")), t.exports = n
    }, {
        "./edf/errors.js": 2,
        "./edf/tesla.js": 3,
        "./global/rum.js": 4,
        "./global/session.js": 5,
        "./nikeID/nikeid_builder_rum.js": 7,
        "./ocp/ocp_data.js": 8,
        "./ocp/ocp_errors.js": 9,
        "./ocp/ocp_submitOrder.js": 10,
        "./pages/pageView.js": 11,
        "./pages/view_cart.js": 12,
        "./pages/view_confirmation.js": 13,
        "./pages/view_pdp.js": 14,
        "./pages/view_product_wall.js": 15
    }],
    7: [function(e, t) {
        var n = e("../../stubs/_lodash.js");
        t.exports = {
            event: function(e) {
                var t = this;
                t.utils.dc = e;
                var i = ["nike.id.Event.BUILDER_START", "nike.id.Event.BUILDER_ENABLED", "nike.id.Event.BUILDER_VIEWS_LOADED", "nike.id.Event.BUILDER_COMPLETE"],
                    r = n.map(i, t.utils.promiseByEvent, t.utils);
                jQuery.when.apply(jQuery, r).then(n.bind(t.utils.sendData, t.utils)), $(window).bind("unload", n.bind(t.utils.sendOnlyResolved(r), t.utils))
            },
            utils: {
                promiseByEvent: function(e) {
                    var t = jQuery.Deferred(),
                        n = this;
                    return $(window).bind(e, function() {
                        t.resolve(e, n.dc.getTime())
                    }), t.promise()
                },
                buildDataObject: function(e) {
                    return n.reduce(e, function(e, t) {
                        var n = t[0].split(".")[3];
                        return e[n] = t[1], e
                    }, {})
                },
                sendData: function() {
                    if (!this.sent) {
                        var e = Array.prototype.slice.call(arguments, 0);
                        this.sent = !0, "object" != typeof e[0] && (e = [e]), this.dc.nodOff("dream_for_catching", $.extend({
                            eventName: "nikeid_builder_rum"
                        }, this.buildDataObject(e)))
                    }
                },
                sendOnlyResolved: function(e) {
                    var t = this;
                    return function() {
                        var i = n.filter(e, function(e) {
                            return e.state && "resolved" === e.state()
                        });
                        i.length && jQuery.when.apply(jQuery, i).then(n.bind(t.sendData, t))
                    }
                }
            }
        }
    }, {
        "../../stubs/_lodash.js": 16
    }],
    8: [function(e, t) {
        var n = e("../../util/util_returnNestedProperty.js");
        t.exports = function(e) {
            var t = n("nike.ocp.analytics.data");
            t && e.nodOff("dream_for_catching", {
                eventName: "ocpData",
                currency: t.currencyCode,
                currentPage: n("nike.ocp.currPage"),
                productList: t.productList
            })
        }
    }, {
        "../../util/util_returnNestedProperty.js": 24
    }],
    9: [function(e, t) {
        var n = e("../../util/util_returnNestedProperty.js"),
            i = e("../../stubs/_lodash.js");
        t.exports = {
            event: function(e) {
                this.utils.dc = e, n("nike.ocp.analytics") && $(window).bind("load", i.bind(this.utils.sendEvent, this))
            },
            utils: {
                sendEvent: function() {
                    var e = this,
                        t = e.utils.fetchErrorObjectData() || e.utils.fetchSpanData();
                    t.length && i.forEach(t, function(t) {
                        var n = $.extend(t, {
                            eventName: "ocpError",
                            url: document.location.href
                        });
                        e.utils.dc.nodOff("dream_for_catching", n)
                    })
                },
                fetchSpanData: function() {
                    return i.map($("#errorData.trackingData"), function(e) {
                        return $(e).data("trackingData")
                    })
                },
                fetchErrorObjectData: function() {
                    return window.errorMessages ? i.map(window.errorMessages, function(e) {
                        var t = e.split(/ \[Code: ?(.*)]/);
                        return {
                            statusCode: t[1] ? t[1] : "",
                            description: t[0]
                        }
                    }) : null
                }
            }
        }
    }, {
        "../../stubs/_lodash.js": 16,
        "../../util/util_returnNestedProperty.js": 24
    }],
    10: [function(e, t) {
        t.exports = function(e) {
            window.nike && window.nike.Event && e.registerEvent({
                name: nike.Event.SUBMIT_ORDER,
                batch: !1
            })
        }
    }, {}],
    11: [function(e, t) {
        var n = e("../../util/util_provideFilteredUrl.js");
        t.exports = {
            event: function(e) {
                e.registerEvent({
                    name: "dreamcatcher.pageview",
                    batch: !1,
                    fields: 1
                }), e.nodOff("dreamcatcher.pageview", {
                    eventName: "page_view",
                    url: n()
                })
            }
        }
    }, {
        "../../util/util_provideFilteredUrl.js": 23
    }],
    12: [function(e, t) {
        var n = e("../../util/util_pageData.js"),
            i = e("../../stubs/_lodash.js");
        t.exports = function(e) {
            var t = n.fetch();
            e.registerPage("cart", function() {
                return {
                    product_ids: i.pluck(t.ocpProductList, "productId"),
                    productCount: t.productCount
                }
            })
        }
    }, {
        "../../stubs/_lodash.js": 16,
        "../../util/util_pageData.js": 21
    }],
    13: [function(e, t) {
        var n = e("../../util/util_pageData.js"),
            i = e("../../stubs/_lodash.js");
        t.exports = function(e) {
            var t = n.fetch();
            e.registerPage("confirm", function() {
                return {
                    orderId: t.orderId,
                    currency: t.currency,
                    product_ids: i.pluck(t.ocpProductList, "productId"),
                    subtotal: t.subtotal
                }
            })
        }
    }, {
        "../../stubs/_lodash.js": 16,
        "../../util/util_pageData.js": 21
    }],
    14: [function(e, t) {
        var n = e("../../util/util_pageData.js").fetch();
        t.exports = function(e) {
            e.registerPage("pdp", function() {
                var e = [];
                return $(".color-chip-container").children().children().each(function() {
                    "undefined" != typeof $(this).attr("data-productid") && e.push($(this).attr("data-productid"))
                }), {
                    pid: n.product_id,
                    colorChips: e
                }
            })
        }
    }, {
        "../../util/util_pageData.js": 21
    }],
    15: [function(e, t) {
        t.exports = function(e) {
            e.registerPage("pagebuilder", function() {
                var e, t = nike.Util.getObjectFromElementJSON($("#body-liner").find("span.trackingData"));
                return e = t ? t.response : {}, {
                    pw_data: e
                }
            }, "view_product_wall")
        }
    }, {}],
    16: [function(e, t) {
        t.exports = window.lodash || window._
    }, {}],
    17: [function(e, t) {
        t.exports = function() {
            return function(e) {
                return function() {
                    return !e.apply(this, arguments)
                }
            }
        }
    }, {}],
    18: [function(e, t) {
        var n = Array.prototype.concat,
            i = Array.prototype.slice;
        t.exports = function(e) {
            return function(t, r, o) {
                if (e.isFunction(r)) r = e.negate(r);
                else {
                    var a = e.map(n.apply([], i.call(arguments, 1)), String);
                    r = function(t, n) {
                        return !e.contains(a, n)
                    }
                }
                return e.pick(t, r, o)
            }
        }
    }, {}],
    19: [function(e, t) {
        var n = e("../stubs/_lodash.js");
        t.exports = function(e) {
            return !e.env.length || !n.contains(e.env, document.location.host.split("-")[0].split(":")[0])
        }
    }, {
        "../stubs/_lodash.js": 16
    }],
    20: [function(e, t) {
        function n(e) {
            this.config = e, this.config.domain = this.generateDomain(), this.config.setTimestamp && (this.config.timestampName = this.config.name + "Timestamp"), this.timestampConditions = o
        }
        var i = e("../vendor/util_cookies.js"),
            r = e("../stubs/_lodash.js"),
            o = [function(e, t, n) {
                return e - n > 18e5
            }, function(e, t, n) {
                var i = 18e5 > e - n,
                    r = e - t > 864e5;
                return i && r
            }];
        n.prototype = {
            create: function() {
                var e = (new Date).getTime(),
                    t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
                        var n = (e + 16 * Math.random()) % 16 | 0;
                        return e = Math.floor(e / 16), ("x" === t ? n : 7 & n | 8).toString(16)
                    });
                return t
            },
            set: function() {
                if (i.set(this.config.name, this.create(), this.config), this.config.setTimestamp) {
                    var e = (new Date).getTime();
                    this.setTimestamp(e, e)
                }
            },
            expire: function() {
                i.expire(this.config.name), this.config.setTimestamp && i.expire(this.config.timestampName)
            },
            get: function() {
                return i.get(this.config.name)
            },
            generateDomain: function(e) {
                var t = e || window.location.hostname.toLowerCase(),
                    n = t.split(".");
                return n.length >= 2 ? "." + n[n.length - 2] + "." + n[n.length - 1] : ".nike.com"
            },
            updateTimestamp: function() {
                var e = i.get(this.config.timestampName),
                    t = e.split("|")[0],
                    n = (new Date).getTime();
                this.setTimestamp(t, n)
            },
            setTimestamp: function(e, t) {
                var n = e + "|" + t;
                i.set(this.config.timestampName, n, this.config)
            },
            checkAndUpdate: function() {
                var e, t = i.get(this.config.timestampName);
                t && (e = t.split("|")), !t || e.length < 2 || this.checkTimestampConditions(e[0], e[1]) ? (this.expire(), this.set()) : this.updateTimestamp()
            },
            checkTimestampConditions: function(e, t) {
                var n = (new Date).getTime(),
                    i = r.map(this.timestampConditions, function(i) {
                        return i(n, e, t)
                    });
                return r.any(i)
            },
            init: function() {
                i.get(this.config.name) ? this.config.setTimestamp && this.checkAndUpdate() : this.set()
            }
        }, t.exports = function(e) {
            return new n(e)
        }
    }, {
        "../stubs/_lodash.js": 16,
        "../vendor/util_cookies.js": 25
    }],
    21: [function(e, t) {
        var n = e("./util_returnNestedProperty.js"),
            i = e("./util_productIdFromUrl.js");
        t.exports = {
            fetch: function() {
                return {
                    productCount: n("nike.ocp.analytics.data.productCount") || n("nike.checkout.analyticsData.productCount"),
                    orderId: n("nike.ocp.analytics.data.orderId") || n("nike.checkout.analyticsData.orderId"),
                    product_id: n("utag_data.product_id") || i(),
                    product_ids: n("utag_data.product_ids"),
                    currency: n("nike.ocp.analytics.data.currencyCode") || n("nike.checkout.analyticsData.currencyCode"),
                    subtotal: n("nike.ocp.analytics.data.pricingData.subtotal") || n("nike.checkout.analyticsData.pricingData.subtotal"),
                    ocpProductList: n("nike.ocp.analytics.data.productList")
                }
            }
        }
    }, {
        "./util_productIdFromUrl.js": 22,
        "./util_returnNestedProperty.js": 24
    }],
    22: [function(e, t) {
        t.exports = function(e) {
            var t = e ? e.split("/") : window.location.pathname.split("/");
            return t[5] && ~t[5].indexOf("pid-") ? t[5].split("pid-")[1] : void 0
        }
    }, {}],
    23: [function(e, t) {
        t.exports = function(e) {
            var t = e || document.location.href,
                n = /[a-zA-Z0-9!#$%'*+^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/g;
            return decodeURIComponent(decodeURIComponent(t)).replace(n, "")
        }
    }, {}],
    24: [function(e, t) {
        t.exports = function(e, t) {
            var n = e.split("."),
                i = t;
            if (!t) {
                var r = n.shift();
                i = this && this[r] || window[r]
            }
            for (var o = 0; o < n.length; o++) {
                if (!(i && n[o] in i)) return null;
                i = i[n[o]]
            }
            return i
        }
    }, {}],
    25: [function(e, t, n) {
        ! function(e, i) {
            "use strict";
            var r = function(e) {
                    if ("object" != typeof e.document) throw new Error("Cookies.js requires a `window` with a `document` object");
                    var t = function(e, n, i) {
                        return 1 === arguments.length ? t.get(e) : t.set(e, n, i)
                    };
                    return t._document = e.document, t._cacheKeyPrefix = "cookey.", t.defaults = {
                        path: "/",
                        secure: !1
                    }, t.get = function(e) {
                        return t._cachedDocumentCookie !== t._document.cookie && t._renewCache(), t._cache[t._cacheKeyPrefix + e]
                    }, t.set = function(e, n, r) {
                        return r = t._getExtendedOptions(r), r.expires = t._getExpiresDate(n === i ? -1 : r.expires), t._document.cookie = t._generateCookieString(e, n, r), t
                    }, t.expire = function(e, n) {
                        return t.set(e, i, n)
                    }, t._getExtendedOptions = function(e) {
                        return {
                            path: e && e.path || t.defaults.path,
                            domain: e && e.domain || t.defaults.domain,
                            expires: e && e.expires || t.defaults.expires,
                            secure: e && e.secure !== i ? e.secure : t.defaults.secure
                        }
                    }, t._isValidDate = function(e) {
                        return "[object Date]" === Object.prototype.toString.call(e) && !isNaN(e.getTime())
                    }, t._getExpiresDate = function(e, n) {
                        switch (n = n || new Date, typeof e) {
                            case "number":
                                e = new Date(n.getTime() + 1e3 * e);
                                break;
                            case "string":
                                e = new Date(e)
                        }
                        if (e && !t._isValidDate(e)) throw new Error("`expires` parameter cannot be converted to a valid Date instance");
                        return e
                    }, t._generateCookieString = function(e, t, n) {
                        e = e.replace(/[^#$&+\^`|]/g, encodeURIComponent), e = e.replace(/\(/g, "%28").replace(/\)/g, "%29"), t = (t + "").replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent), n = n || {};
                        var i = e + "=" + t;
                        return i += n.path ? ";path=" + n.path : "", i += n.domain ? ";domain=" + n.domain : "", i += n.expires ? ";expires=" + n.expires.toUTCString() : "", i += n.secure ? ";secure" : ""
                    }, t._getCacheFromString = function(e) {
                        for (var n = {}, r = e ? e.split("; ") : [], o = 0; o < r.length; o++) {
                            var a = t._getKeyValuePairFromCookieString(r[o]);
                            n[t._cacheKeyPrefix + a.key] === i && (n[t._cacheKeyPrefix + a.key] = a.value)
                        }
                        return n
                    }, t._getKeyValuePairFromCookieString = function(e) {
                        var t = e.indexOf("=");
                        return t = 0 > t ? e.length : t, {
                            key: decodeURIComponent(e.substr(0, t)),
                            value: decodeURIComponent(e.substr(t + 1))
                        }
                    }, t._renewCache = function() {
                        t._cache = t._getCacheFromString(t._document.cookie), t._cachedDocumentCookie = t._document.cookie
                    }, t._areEnabled = function() {
                        var e = "cookies.js",
                            n = "1" === t.set(e, 1).get(e);
                        return t.expire(e), n
                    }, t.enabled = t._areEnabled(), t
                },
                o = "object" == typeof e.document ? r(e) : r;
            "object" == typeof n ? ("object" == typeof t && "object" == typeof t.exports && (n = t.exports = o), n.Cookies = o) : e.Cookies = o
        }("undefined" == typeof window ? this : window)
    }, {}],
    26: [function(e, t) {
        t.exports = function() {
            ! function(e) {
                e(jQuery)
            }(function(e) {
                if (!e.support.cors && e.ajaxTransport && window.XDomainRequest) {
                    {
                        var t = /^get|post$/i;
                        new RegExp("^" + location.protocol, "i")
                    }
                    e.ajaxTransport("* text html xml json", function(n, i) {
                        if (n.crossDomain && n.async && t.test(n.type) && n.dreamcatcher) {
                            var r = null;
                            return {
                                send: function(t, o) {
                                    var a = "",
                                        s = (i.dataType || "").toLowerCase();
                                    r = new XDomainRequest, /^\d+$/.test(i.timeout) && (r.timeout = i.timeout), r.ontimeout = function() {
                                        o(500, "timeout")
                                    }, r.onload = function() {
                                        var t = "Content-Length: " + r.responseText.length + "\r\nContent-Type: " + r.contentType,
                                            n = {
                                                code: 200,
                                                message: "success"
                                            },
                                            i = {
                                                text: r.responseText
                                            };
                                        try {
                                            if ("html" === s || /text\/html/i.test(r.contentType)) i.html = r.responseText;
                                            else if ("json" === s || "text" !== s && /\/json/i.test(r.contentType)) try {
                                                i.json = e.parseJSON(r.responseText)
                                            } catch (a) {
                                                n.code = 500, n.message = "parseerror"
                                            } else if ("xml" === s || "text" !== s && /\/xml/i.test(r.contentType)) {
                                                var c = new ActiveXObject("Microsoft.XMLDOM");
                                                c.async = !1;
                                                try {
                                                    c.loadXML(r.responseText)
                                                } catch (a) {
                                                    c = void 0
                                                }
                                                if (!c || !c.documentElement || c.getElementsByTagName("parsererror").length) throw n.code = 500, n.message = "parseerror", "Invalid XML: " + r.responseText;
                                                i.xml = c
                                            }
                                        } catch (u) {
                                            throw u
                                        } finally {
                                            o(n.code, n.message, i, t)
                                        }
                                    }, r.onprogress = function() {}, r.onerror = function() {
                                        o(500, "error", {
                                            text: r.responseText
                                        })
                                    }, i.data && (a = "string" === e.type(i.data) ? i.data : e.param(i.data)), r.open(n.type, n.url), r.send(a)
                                },
                                abort: function() {
                                    r && r.abort()
                                }
                            }
                        }
                    })
                }
            })
        }
    }, {}],
    27: [function(e, t) {
        var n = 31536e4;
        t.exports = {
            guidS: {
                name: "guidS",
                expires: n,
                path: "/",
                setTimestamp: !0
            },
            guidU: {
                name: "guidU",
                expires: n,
                path: "/"
            }
        }
    }, {}],
    28: [function(e, t) {
        var n = e("../package.json");
        t.exports = {
            version: n.version,
            endpoint: "//nod.nikecloud.com/nod/rest/intake",
            env: ["ecn4"],
            country: ["US"],
            eventQueueLength: 1,
            storageIdentifier: "dreams_store",
            globalObjectName: "dreamcatcher",
            disabled: ["heartbeat"]
        }
    }, {
        "../package.json": 29
    }],
    29: [function(e, t) {
        t.exports = {
            name: "dreamcatcher",
            version: "0.9.7",
            description: "Real-time analytics",
            main: "dc.js",
            dependencies: {},
            devDependencies: {
                async: "^0.9.0",
                "aws-sdk": "^2.0.19",
                bluebird: "^2.3.6",
                brfs: "^1.4.0",
                browserify: "^8.1.0",
                "browserify-istanbul": "^0.2.1",
                "browserify-shim": "^3.8.3",
                chai: "^1.9.1",
                "cli-color": "^0.3.2",
                del: "^0.1.3",
                envify: "^3.4.0",
                "git-scripts": "^0.1.2",
                gulp: "^3.8.6",
                "gulp-awspublish": "^0.0.23",
                "gulp-concat": "^2.3.3",
                "gulp-if": "^1.2.4",
                "gulp-jshint": "^1.7.0",
                "gulp-load-plugins": "^0.5.3",
                "gulp-notify": "^1.6.0",
                "gulp-rename": "^1.2.0",
                "gulp-sourcemaps": "^1.1.5",
                "gulp-uglify": "^1.0.1",
                "gulp-util": "^3.0.1",
                js2xmlparser: "^0.1.5",
                "jshint-stylish": "^1.0.0",
                karma: "^0.12.22",
                "karma-bro": "^0.11.1",
                "karma-chai": "^0.1.0",
                "karma-chrome-launcher": "^0.1.5",
                "karma-coverage": "^0.2.6",
                "karma-firefox-launcher": "^0.1.3",
                "karma-jquery": "^0.1.0",
                "karma-junit-reporter": "^0.2.2",
                "karma-mocha": "^0.1.9",
                "karma-mocha-reporter": "^0.3.1",
                "karma-phantomjs-launcher": "^0.1.4",
                "karma-safari-launcher": "^0.1.1",
                "karma-sinon-ie": "^1.0.1",
                lodash: "^2.4.1",
                mocha: "^1.21.4",
                "node-dir": "^0.1.6",
                sinon: "^1.10.3",
                "vinyl-buffer": "^1.0.0",
                "vinyl-source-stream": "^1.0.0",
                webdriverio: "2.3.*"
            },
            scripts: {
                test: "gulp test"
            },
            repository: {
                type: "git",
                url: "ssh://git@stash.nikedev.com/dreams/dreamcatcher.git"
            },
            git: {
                scripts: {
                    "pre-commit": "gulp test:unit"
                }
            },
            jscsConfig: {
                preset: "google",
                validateIndentation: "	",
                requireMultipleVarDecl: null,
                requireSpacesInsideArrayBrackets: "all",
                disallowSpacesInsideArrayBrackets: null,
                validateQuoteMarks: '"',
                disallowQuotedKeysInObjects: !1,
                maximumLineLength: {
                    value: 100
                }
            },
            author: "",
            license: "ISC"
        }
    }, {}]
}, {}, [1]);