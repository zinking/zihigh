
try {
    var nike = nike || {};
    nike.namespace("nike.ServiceUtil");
    nike.ServiceUtil.getFormData = function(c, b) {
        var f, a, e, d = {};
        $(c).find(":input[name]").each(function() {
            a = $(this);
            if (a.is(":checkbox")) {
                d[a.attr("name")] = a.is(":checked")
            } else {
                if (a.is(":radio")) {
                    if (a.is(":checked")) {
                        d[a.attr("name")] = a.val()
                    }
                } else {
                    if (a.attr("name") == "postalCode") {
                        a = $(c).find("input[name=postalCode]:visible")
                    }
                    f = a.val();
                    if ((f && f.length > 0) || b) {
                        d[a.attr("name")] = a.val()
                    } else {
                        d[a.attr("name")] = null
                    }
                }
            }
        });
        $(c).find("select").each(function() {
            e = $(this);
            if (e.attr("name") == "state") {
                e = $(c).find(".state_select:visible").find("select")
            }
            f = e.val();
            if (f && f.length > 0) {
                d[e.attr("name")] = f
            }
        });
        return d
    };
} catch (ex) {
    if (nike.error) {
        nike.error('An unhandled exception was thrown while executing nike.ServiceUtil. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
    }
}