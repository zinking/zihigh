

try {
    var nike = nike || {};
    nike.namespace("nike.EventBus");
    nike.requireDependency("jQuery");
    (function(a) {
        var e = {};
        a.EventBus = $.extend(a.EventBus, {
            listen: function(j, k) {
                var h = typeof j == "string" ? [j] : j;
                for (var g = 0, f = h.length; g < f; g++) {
                    $(a.global).bind(h[g], k)
                }
            },
            unlisten: function(j, k) {
                var h = typeof j == "string" ? [j] : j;
                for (var g = 0, f = h.length; g < f; g++) {
                    $(a.global).unbind(h[g], k)
                }
            },
            hasListener: function(f) {
                var g = false;
                $.each($(a.global).data("events"), function(h, j) {
                    $.each(j, function(k, l) {
                        if (l.type == f) {
                            g = true
                        }
                    })
                });
                return g
            },
            deferredListen: function b(f, g) {
                if (!f) {
                    a.error("blah");
                    return
                } else {
                    if (!e[f]) {
                        e[f] = $.Callbacks("unique")
                    }
                }
                e[f].add(g)
            },
            deferredUnlisten: function c(f, g) {
                if (f && e[f]) {
                    e[f].remove(g)
                }
            },
            deferredHasListener: function d(f, g) {
                return f && e[f] && e[f].has(g)
            },
            dispatchEvent: function(h, i) {
                a.info("EVENT: " + h + " - DATA: ", i);
                if (window.performance && window.performance.mark) {
                    var g = h;
                    var f = "_";
                    switch (h) {
                        case a.EVENT_GADGET_LOADED:
                            g += f + i.gadgetName;
                            break;
                        case a.EVENT_EXTERNAL_RESOURCES_LOADED:
                            if (i.resourcesLoaded) {
                                g += f + i.resourcesLoaded.join("-")
                            }
                            break;
                        default:
                            g = h
                    }
                    window.performance.mark(g)
                }
                $(a.global).trigger(h, i);
                if (h && e[h]) {
                    setTimeout(function() {
                        e[h].fire(h, i)
                    }, 0)
                }
            },
            gadgetListensTo: function(g, k) {
                var h = $(g).data("listen");
                if (!h || !k) {
                    return true
                } else {
                    var f = h.split(",");
                    for (var j = 0; j < f.length; j++) {
                        if (f[j] == $(k).attr("id")) {
                            return true
                        }
                    }
                }
                return false
            },
            gadgetListensToEach: function(f, g, h) {
                if (f && h) {
                    $('div[data-gadget="' + f + '"]').each(function() {
                        var i = $(this);
                        if (a.EventBus.gadgetListensTo(i, g)) {
                            h.call($(this))
                        }
                    })
                }
            }
        })
    })(nike);
    $.extend(nike, nike.EventBus);
} catch (ex) {
    if (nike.error) {
        nike.error('An unhandled exception was thrown while executing nike.EventBus. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
    }
}
