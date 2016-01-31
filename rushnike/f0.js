
try {
    var nike = nike || {};
    nike.namespace("nike.exp.pdp.PdpBuyingTools");
    nike.requireDependency("nike.Cart");
    nike.requireDependency("nike.Event");
    nike.requireDependency("nike.ServiceUtil");
    nike.requireDependency("nike.Util");
    nike.requireDependency("nike.Wishlist");
    nike.requireDependency("nike.exp.pdp.PdpToolTip");
    nike.requireDependency("nike.exp.global.Form");
    nike.requireDependency("nike.exp.global.Modal");
    nike.requireDependency("nike.exp.profile.ForgotPassword");
    nike.requireDependency("nike.exp.profile.ProfileStateController");
    nike.requireDependency("nike.style.nsg.Classes");
    nike.requireDependency("nike.exp.pdp.TetheredAccessCode");
    nike.exp.pdp.PdpBuyingTools = function(b) {
        var a = this;
        a.els = {};
        a.settings = {
            classes: {
                invalid: "is-invalid",
                sizeToolTip: "exp-tooltip",
                accessCode: {
                    emptyForms: "empty-forms",
                    loginError: "login-error",
                    errorCont: "error-container",
                    hidePasscode: "hide-passcode",
                    notTethered: "not-tethered",
                    notLoggedIn: "not-logged-in",
                    error: "error"
                }
            },
            data: {
                accessCode: {},
                currentProduct: {}
            },
            flags: {
                accessCode: false
            },
            selectors: {
                accessCode: {
                    form: ".passcode-form",
                    loginForm: ".passcode-login-form",
                    modal: "#exp-pdp-buying-tools-container .exp-access-code-modal-content",
                    unlockBtn: ".exp-pdp-unlock-button",
                    submitBtn: ".js-modal-submit",
                    continueBtn: ".js-modal-continue"
                },
                notifyMe: {
                    form: "#notify-me-form",
                    link: ".exp-pdp-notify-me-link",
                    modal: "#exp-pdp-buying-tools-container .exp-notify-me-modal-content"
                },
                buyingTools: {
                    additionalSizeInfoSelect: ".exp-pdp-size-dropdown-additional-info",
                    addToCart: ".add-to-cart-form button.add-to-cart",
                    addToLocker: ".add-to-cart-form a.pdp-mylocker",
                    form: ".add-to-cart-form",
                    sizeSelect: "select.exp-pdp-size-dropdown",
                    sizeWrapper: ".exp-pdp-size-dropdown-container",
                    fakeSizeSelect: ".exp-pdp-size-container",
                    quantitySelect: 'select[name="qty"]',
                    sizeNotInStock: ".exp-pdp-size-not-in-stock"
                }
            },
            content: {
                sizeToolTipText: "Default tooltip text",
                sizeToolTipQAAttr: undefined
            }
        };
        a.settings = $.extend(true, a.settings, b);
        if (b) {
            a.init()
        }
    };
    nike.exp.pdp.PdpBuyingTools.prototype = {
        accessCodeSubmitted: function() {
            var a = this;
            var b = $(a.settings.selectors.accessCode.form).find('input[name="passcode"]');
            b.val(b.val().toUpperCase());
            a.showLoadingScreen();
            nike.dispatchEvent(nike.Event.ACCESS_CODE_MODAL_CLICK_EVENT, {
                prop3: "passcode:submit:passcode",
                productId: a.settings.data.currentProduct.productId
            });
            a.tethered.checkAccessCode({
                passcode: b.val().trim()
            })
        },
        accessCodeSuccess: function(f) {
            var a = this;
            a.settings.data.currentProduct.unlocked = true;
            a.settings.data.currentProduct.passcode = (f.manual) ? a.els.accessCodeModal.$content.find(a.settings.selectors.accessCode.form + ' input[name="passcode"]').val().trim() : f.passcode;
            a.els.accessCodeModal.close();
            var e = nike.exp.pdp.PdpPage.addPageData({});
            e.pdpData = a.settings.data.currentProduct;
            if (f.skuId != "") {
                var c = e.pdpData.skuContainer.productSkus;
                for (var b = 0; b < c.length; b++) {
                    var d = c[b];
                    if (d.sku == f.skuId) {
                        e.pdpData.skuContainer.productSkus = [d];
                        break
                    }
                }
            }
            nike.exp.pdp.TemplateRenderer.renderTemplate(e)
        },
        accessCodeError: function(f) {
            var d = this;
            var a = f.errorTitle || "";
            var k = f.exceptions[0].errorcode;
            var j = !!(f.modalType === "read");
            var m, g, b;
            var c = [];
            var e = d.els.accessCodeModal.$content;
            for (g = 0, b = f.exceptions.length; g < b; g++) {
                c.push(f.exceptions[g].message)
            }
            d.resetTetheredAccessCodeModal();
            if (d.els.accessCodeModal.$contentContainer.is(":visible")) {
                var l = $(".access-code-modal");
                var h = l.width();
                l.css("max-width", h);
                d.els.accessCodeModal.$content.addClass("error").removeClass("failure");
                $(".error-title").text(a);
                $(".error-subheader .error-text").html(c.join(" "));
                if (j) {
                    d.els.accessCodeModal.$content.addClass("read-only")
                }
                $("input[name=passcode]").val("");
                $("input[name=passcode]").siblings(".default-value").toggle(true)
            } else {
                if (!f.tethered) {
                    if (f.exceptions != undefined) {
                        $(".error-title").text(a);
                        $(".error-subheader .error-text").html(c.join(" "));
                        if (j) {
                            d.els.accessCodeModal.$content.addClass("read-only")
                        }
                        $("input[name=passcode]").val("");
                        $("input[name=passcode]").siblings(".default-value").toggle(true);
                        e.addClass("error").removeClass(d.settings.classes.accessCode.notTethered)
                    }
                    if (f.exceptions.length && f.exceptions[0].errorcode == "passcodeNotFound") {
                        e.addClass(d.settings.classes.accessCode.notTethered)
                    }
                }
                d.els.accessCodeModal.open()
            }
            switch (k) {
                case "skuIsOOS":
                    $(".access-code-field").hide();
                    e.addClass(d.settings.classes.accessCode.hidePasscode);
                    $(".button-container .js-modal-submit").hide();
                    $(".button-container .js-modal-continue").show();
                    break;
                default:
                    $(".access-code-field").show();
                    $(".button-container .js-modal-submit").show();
                    $(".button-container .js-modal-continue").hide()
            }
            d.hideLoadingScreen();
            nike.dispatchEvent(nike.Event.UNLOCK_MODAL_VIEW_EVENT, {
                productId: d.settings.data.currentProduct.productId,
                modalType: f.modalType,
                errorcode: f.exceptions[0].errorcode
            })
        },
        accessCodeFailure: function(d) {
            var b = this;
            var c = b.els.accessCodeModal;
            var a = c.width();
            c.css("max-width", a);
            b.els.accessCodeModal.$content.addClass("failure").removeClass("error");
            $("input[name=passcode]").val("");
            $("input[name=passcode]").siblings(".default-value").toggle(true)
        },
        addToCart: function(d) {
            d.preventDefault();
            var b = this; //els settings isOnlyOneInStock
            var c = b.els.form,
                f = c.hasClass("outfitter-form");
            if (b.validateAddTo(c, b.settings.selectors.buyingTools.sizeSelect)) {
                var e = nike.ServiceUtil.getFormData(c);
                // "addItem" lang_locale "zh_CN" country "CN" catalogId "4" productId "10264996" price "839" siteId null line1 "Air Jordan Future Low" line2 "男孩运动童鞋" passcode null sizeType null skuAndSize "11565093:40" qty "1" rt "json" view 3 skuId "11565093" displaySize
                var a = $(".exp-pdp-product-price-container");
                if (a.length) {
                    e.price = a.find('[itemprop="price"]').html().replace(/[^\d\.]/g, "")
                }
                if (f) {
                    e.outfitter = true
                }
                nike.Cart.addToCart(e, c, b.resetDropdowns.bind(b), b.resetDropdowns.bind(b))
            }
        },
        addToLocker: function(d) {
            d.preventDefault();
            var a = this;
            var c = a.els.form;
            if (a.validateAddTo(c, a.settings.selectors.buyingTools.sizeSelect, true)) {
                var e = nike.ServiceUtil.getFormData(c);
                var b;
                e.rt = "json";
                e.priorityId = 3;
                e.action = "addWishListItem";
                e.quantity = e.qty;
                if (e.skuAndSize) {
                    b = e.skuAndSize.split(":");
                    e.skuId = b[0];
                    if (b[1]) {
                        e.displaySize = b[1]
                    }
                }
                nike.dispatchEvent(nike.Event.ADD_WISHLIST_ITEM_CLICK, {
                    data: e,
                    element: c
                });
                nike.Wishlist.addToWishlist(e, c, a.resetDropdowns.bind(a), a.resetDropdowns.bind(a))
            }
        },
        init: function() {
            var e = this;
            if ($(e.settings.selectors.buyingTools.form).length > 0) {
                e.els.form = $(e.settings.selectors.buyingTools.form);
                e.els.sizeSelect = e.els.form.find(e.settings.selectors.buyingTools.sizeSelect);
                e.els.quantitySelect = e.els.form.find(e.settings.selectors.buyingTools.quantitySelect);
                e.els.additionalSizeInfo = e.els.form.find(e.settings.selectors.buyingTools.additionalSizeInfoSelect);
                var i = e.els.sizeSelect.find("option:not(" + e.settings.selectors.buyingTools.sizeNotInStock + ")");
                var a = e.els.sizeSelect.find("option").length - i.length === 1;
                e.isOnlyOneInStock = i.length == 1;
                var b = nike.Cart.getCartSummaryFromCookie();
                if (b && b.userType == nike.Cart.UserType.EMPLOYEE && e.els.quantitySelect.children().length === 10) {
                    e.els.quantitySelect.find("option:gt(5)").remove()
                }
                $(e.settings.selectors.buyingTools.sizeSelect + ", " + e.settings.selectors.buyingTools.quantitySelect).selectBox({
                    autoWidth: false,
                    parentOffset: true
                });
                e.els.fakeSizeSelect = e.els.form.find(e.settings.selectors.buyingTools.fakeSizeSelect);
                if (e.els.form.find(e.settings.selectors.buyingTools.sizeWrapper).length === 0) {
                    e.els.sizeSelect.selectBox("addWrapper", e.settings.selectors.buyingTools.sizeWrapper.replace(".", ""))
                }
                e.addRoundedCornersToSizeDropdown();
                e.addSizeSelectListener();
                if (!a) {
                    if ($(e.settings.selectors.buyingTools.sizeWrapper).length > 0) {
                        e.els.additionalSizeInfo.detach().appendTo($(e.settings.selectors.buyingTools.sizeWrapper))
                    } else {
                        $(document).on("nsgReady", function() {
                            e.els.additionalSizeInfo.detach().appendTo($(e.settings.selectors.buyingTools.sizeWrapper))
                        })
                    }
                    if ($(e.els.additionalSizeInfo).children().length > 0) {
                        $(e.els.additionalSizeInfo).addClass("has-content")
                    }
                }
                if (e.els.sizeSelect.find("option").length > 2) {
                    e.els.fakeSizeSelect.find("a").on("click", function(k) {
                        if (e.els.fakeSizeSelect.hasClass("selectBox-open")) {
                            nike.dispatchEvent(nike.Event.SIZE_SELECTION_OPEN, {})
                        }
                    })
                }
                e.els.fakeSizeSelect.find("li" + e.settings.selectors.buyingTools.sizeNotInStock).unbind().click(function(k) {
                    k.preventDefault()
                });
                $(e.settings.selectors.buyingTools.addToCart).on("click", e.addToCart.bind(e));
                $(e.settings.selectors.buyingTools.addToLocker).on("click", e.addToLocker.bind(e));
                if (e.isOnlyOneInStock) {
                    var f = e.els.sizeSelect.find("option:not(" + e.settings.selectors.buyingTools.sizeNotInStock + ")");
                    var c = "(" + f.text().trim() + ")";
                    e.els.sizeSelect.val(f.val()).selectBox("value", f.val()).change();
                    e.els.fakeSizeSelect.find(".selectBox-label").text(c)
                }
                if (e.els.sizeSelect.find("option").length === 2) {
                    e.els.form.find(".exp-pdp-size-dropdown").off()
                }
                if (e.settings.data.accessCode.skuId) {
                    var g = e.els.sizeSelect.find('option[value^="' + e.settings.data.accessCode.skuId + ':"]');
                    var j = g.val();
                    var h = g.data("label");
                    e.els.sizeSelect.selectBox("value", j);
                    e.els.sizeSelect.change();
                    $(".exp-pdp-size-dropdown .selectBox-label").text(h);
                    e.els.sizeSelect.selectBox("disable");
                    e.els.fakeSizeSelect.addClass("disabled")
                }
                e.els.quantitySelect.trigger("change");
                if ($(e.settings.selectors.notifyMe.link).length > 0) {
                    e.setupNotifyMeModal()
                }
            } else {
                if ($(e.settings.selectors.accessCode.modal).length > 0) {
                    var d = $(e.settings.selectors.accessCode.unlockBtn);
                    e.tethered = new nike.exp.pdp.TetheredAccessCode({
                        productId: e.settings.data.currentProduct.productId
                    });
                    d.on("click", function(k) {
                        k.preventDefault();
                        k.stopImmediatePropagation();
                        $("input[name=passcode]").val("");
                        nike.dispatchEvent(nike.Event.UNLOCK_BUTTON_CLICK_EVENT, {});
                        $(".exp-forgot-password-success").hide();
                        $(".access-code-field").show();
                        $(".button-container .js-modal-submit").show();
                        $(".button-container .js-modal-continue").hide();
                        e.els.accessCodeModalPasscodeForm.clearForm();
                        e.els.accessCodeModalPasscodeForm.initializeFormValues()
                    });
                    e.els.accessCodeModal = new nike.exp.global.Modal({
                        $content: $(e.settings.selectors.accessCode.modal),
                        autoDestroy: false,
                        blockerClickCloses: false,
                        onClose: function() {
                            this.$content.removeClass("error expired read-only failure");
                            this.$contentContainer.find('input[name="passcode"]').val("");
                            e.resetTetheredAccessCodeModal();
                            e.removeAccessCodeListeners();
                            e.hideLoadingScreen();
                            if (e.forgotPassword) {
                                e.forgotPassword.content.remove()
                            }
                        }
                    });
                    e.els.accessCodeModal.$contentContainer.addClass("access-code-modal");
                    e.els.accessCodeModalPasscodeForm = new nike.exp.global.Form($(e.settings.selectors.accessCode.form));
                    e.els.accessCodeModalPasscodeForm.onSubmit = function() {
                        e.handleTetheredAccessCodeModalSubmit()
                    };
                    e.els.accessCodeModalLoginForm = new nike.exp.global.Form($(e.settings.selectors.accessCode.loginForm));
                    e.els.accessCodeModalLoginForm.onSubmit = function() {
                        e.handleTetheredAccessCodeLoginSubmit()
                    };
                    e.els.accessCodeModalLoginForm.onFailedFormValidation = function() {
                        e.els.accessCodeModalLoginForm.formEl.find("input." + nike.style.nsg.Classes.INVALID).on("focusout mouseout", function() {
                            $(this).parent().find(".notifier").removeClass("visible")
                        })
                    };
                    e.els.accessCodeModal.$content.find(e.settings.selectors.accessCode.submitBtn).on("click touchend", $.proxy(e.handleTetheredAccessCodeModalSubmit, e));
                    e.els.accessCodeModal.$content.find(e.settings.selectors.accessCode.continueBtn).on("click touchend", $.proxy(e.handleTetheredAccessCodeModalContinue, e));
                    $(".continue-button-container .continue-button").on("click", function() {
                        e.els.accessCodeModal.close()
                    });
                    nike.listen(nike.Event.UNLOCK_BUTTON_CLICK_EVENT, function() {
                        e.els.accessCodeModalLoginForm.clearForm();
                        e.addAccessCodeListeners();
                        e.showLoadingScreen();
                        e.tethered.accessCodeBtnClicked()
                    });
                    nike.listen(nike.Event.ACCESS_CODE_SUCCESS_EVENT, function(l, k) {
                        e.accessCodeSuccess(k)
                    });
                    nike.listen(nike.Event.ACCESS_CODE_ERROR, function(l, k) {
                        e.accessCodeError(k)
                    });
                    nike.listen(nike.Event.TETHERED_ACCESS_CODE_PROFILE_NOT_TETHERED, function(l, k) {
                        e.accessCodeError(k)
                    });
                    nike.listen(nike.Event.ACCESS_CODE_FAILURE, function(l, k) {
                        e.accessCodeFailure(k)
                    })
                }
            }
            nike.listen(nike.Event.SMARTCART_QUEUE_EXIT, e.resetDropdowns.bind(e))
        },
        openAccessCodeModal: function() {
            var a = this;
            a.els.accessCodeModal.open();
            nike.dispatchEvent(nike.Event.UNLOCK_MODAL_VIEW_EVENT, {
                productId: a.settings.data.currentProduct.productId,
                modalType: "initial"
            })
        },
        handleTetheredAccessCodeResponse: function(b, c) {
            var a = this;
            a.hideLoadingScreen();
            if (c.status == "success") {
                a.accessCodeSuccess(c)
            } else {
                a.accessCodeError(c);
                a.openAccessCodeModal()
            }
        },
        handleTetheredAccessCodeResponseFailure: function(f, g) {
            var a = this;
            var d = Modernizr.touch ? "touchstart" : "click";
            var b = a.els.accessCodeModal.$content;
            b.removeClass(a.settings.classes.accessCode.notTethered);
            a.openAccessCodeModal();
            a.forgotPassword = new nike.exp.profile.ForgotPassword(a.els.accessCodeModal.$content.find('[name="passcode-password-reset-form"]'));
            a.forgotPassword.eventOverride.passwordReset = {
                event: nike.Event.TETHERED_ACCESS_CODE_PASSWORD_RESET_EMAIL_SENT,
                data: {}
            };
            b.find(".exp-login-forgot-password-link a").on(d, function c(h) {
                h.preventDefault();
                h.stopImmediatePropagation();
                $(this).toggleClass("active");
                a.forgotPassword.toggle();
                a.forgotPassword.setEmail($(".passcode-login-form").find("input[name=email]").val())
            })
        },
        handleTetheredAccessCodeLoginSubmit: function() {
            var a = this;
            a.resetTetheredAccessCodeModal();
            a.showLoadingScreen();
            a.tethered.handleLogin(a.els.accessCodeModalLoginForm)
        },
        handleTetheredAccessCodeLoginSuccess: function(c, d) {
            var a = this;
            var b = a.els.accessCodeModal;
            b.close();
            a.tethered.accessCodeBtnClicked()
        },
        handleTetheredAccessCodeLoginFailure: function(b, c) {
            var a = this.els.accessCodeModal.$content;
            this.hideLoadingScreen();
            this.showAccessCodeLoginFailureMessage(a, c.error)
        },
        showAccessCodeLoginFailureMessage: function(a, b) {
            if (b == "") {
                a.addClass(this.settings.classes.accessCode.loginError).find(".error-subheader").addClass(this.settings.classes.accessCode.errorCont)
            } else {
                a.addClass(this.settings.classes.accessCode.loginError).find(".error-subheader").addClass(this.settings.classes.accessCode.errorCont).find(".error-text").html(b)
            }
        },
        handleTetheredAccessCodeModalContinue: function() {
            var a = this;
            a.els.accessCodeModal.close()
        },
        resetTetheredAccessCodeModal: function() {
            var a = this;
            var c = a.els.accessCodeModal.$content;
            var d = a.settings.classes.accessCode;
            for (var b in d) {
                c.removeClass(d[b])
            }
            c.find(".error-subheader").removeClass(this.settings.classes.accessCode.errorCont)
        },
        handleTetheredAccessCodeModalSubmit: function() {
            var b = this;
            var d = b.els.accessCodeModal.$content;
            var g = b.els.accessCodeModalLoginForm;
            var c = b.els.accessCodeModalPasscodeForm;
            var e = false;
            var a = true;
            b.showLoadingScreen();
            if (g.formEl.is(":visible")) {
                g.formEl.find(":input").not('[type="submit"]').each(function() {
                    if ($(this).val().trim() != "") {
                        e = true;
                        return false
                    }
                });
                if (e) {
                    nike.dispatchEvent(nike.Event.ACCESS_CODE_MODAL_CLICK_EVENT, {
                        prop3: "passcode:submit:email",
                        productId: b.settings.data.currentProduct.productId
                    });
                    b.handleTetheredAccessCodeLoginSubmit();
                    return false
                }
            } else {
                a = false
            }
            c.formEl.find(":input").not('[type="submit"]').each(function() {
                if ($(this).val().trim() != "") {
                    e = true;
                    return false
                }
            });
            if (e || (!a && e)) {
                b.accessCodeSubmitted();
                return false
            } else {
                if (!a && !e) {
                    c.formEl.submit();
                    b.hideLoadingScreen();
                    return false
                }
            }
            c.clearForm();
            g.clearForm();
            if (nike.exp.profile.ProfileStateController.getUserState().loggedIn) {
                b.tethered.accessCodeBtnClicked();
                return false
            }
            var f = d.find(".js-empty-forms-error");
            b.resetTetheredAccessCodeModal();
            d.addClass(b.settings.classes.accessCode.emptyForms);
            f.find(".error-text").html(f.data("emptyFormsError"));
            b.hideLoadingScreen()
        },
        showLoadingScreen: function() {
            if (nike.gadget.LoadingScreen && !nike.gadget.LoadingScreen.showing) {
                nike.gadget.LoadingScreen.show()
            }
        },
        hideLoadingScreen: function() {
            if (nike.gadget.LoadingScreen) {
                nike.gadget.LoadingScreen.hide()
            }
        },
        addAccessCodeListeners: function() {
            var a = this;
            nike.listen(nike.Event.TETHERED_ACCESS_CODE_RESPONSE_SUCCESS, $.proxy(a.handleTetheredAccessCodeResponse, a));
            nike.listen(nike.Event.TETHERED_ACCESS_CODE_NOT_LOGGED_IN, $.proxy(a.openAccessCodeModal, a));
            nike.listen(nike.Event.TETHERED_ACCESS_CODE_RESPONSE_FAILURE, $.proxy(a.handleTetheredAccessCodeResponseFailure, a));
            nike.listen(nike.Event.TETHERED_ACCESS_CODE_PROFILE_CHECK_FAILURE, $.proxy(a.handleTetheredAccessCodeResponseFailure, a));
            nike.listen(nike.Event.UNLOCK_MODAL_VIEW_EVENT, a.hideLoadingScreen);
            a.els.accessCodeModalLoginForm.attachListeners();
            a.els.accessCodeModalPasscodeForm.attachListeners();
            nike.listen(nike.Event.TETHERED_ACCESS_CODE_USER_LOGIN_SUCCESS, $.proxy(a.handleTetheredAccessCodeLoginSuccess, a));
            nike.listen(nike.Event.TETHERED_ACCESS_CODE_USER_LOGIN_FAILURE, $.proxy(a.handleTetheredAccessCodeLoginFailure, a))
        },
        removeAccessCodeListeners: function() {
            var a = this;
            nike.unlisten(nike.Event.TETHERED_ACCESS_CODE_RESPONSE_SUCCESS);
            nike.unlisten(nike.Event.TETHERED_ACCESS_CODE_NOT_LOGGED_IN);
            nike.unlisten(nike.Event.TETHERED_ACCESS_CODE_RESPONSE_FAILURE);
            nike.unlisten(nike.Event.TETHERED_ACCESS_CODE_PROFILE_CHECK_FAILURE);
            nike.unlisten(nike.Event.UNLOCK_MODAL_VIEW_EVENT);
            a.els.accessCodeModalLoginForm.removeListeners();
            a.els.accessCodeModalPasscodeForm.removeListeners();
            nike.unlisten(nike.Event.TETHERED_ACCESS_CODE_USER_LOGIN_SUCCESS);
            nike.unlisten(nike.Event.TETHERED_ACCESS_CODE_USER_LOGIN_FAILURE);
            if (a.forgotPassword) {
                a.forgotPassword.removeListeners()
            }
        },
        addRoundedCornersToSizeDropdown: function() {
            var c = this.els.fakeSizeSelect;
            this.els.fakeSizeSelect.find(this.settings.selectors.buyingTools.sizeWrapper + ", ul").show().find("li").each(function(e) {
                var d = $(this);
                if (d.prev().is("li") && d.prev().position().top != d.position().top || e === 0) {
                    d.addClass("first-in-row");
                    if (d.parent().hasClass("two-column-dropdown")) {
                        nike.Util.addQaAttribute(d, "otherproduct.size.columnone")
                    } else {
                        nike.Util.addQaAttribute(d, "footwearproduct.size.columnone")
                    }
                } else {
                    if (!d.next().is("li") || d.next().position().top != d.position().top) {
                        d.addClass("last-in-row");
                        if (d.parent().hasClass("two-column-dropdown")) {
                            nike.Util.addQaAttribute(d, "otherproduct.size.columntwo")
                        } else {
                            nike.Util.addQaAttribute(d, "footwearproduct.size.columnthree")
                        }
                    }
                }
                if (!d.data("qa")) {
                    nike.Util.addQaAttribute(d, "footwearproduct.size.columntwo")
                }
            }).parents(this.settings.selectors.buyingTools.sizeWrapper).hide();
            c.find(".first-in-row").first().addClass("upper-left");
            c.find(".first-in-row").last().not(".upper-left").addClass("lower-left");
            c.find(".last-in-row").first().addClass("upper-right");
            var a = c.find("li").last();
            var b = $(this.settings.selectors.buyingTools.sizeWrapper);
            b.show();
            if (c.find(".upper-right").length > 0 && a.position().left == c.find(".upper-right").position().left) {
                a.addClass("lower-right")
            }
            b.hide()
        },
        resetDropdowns: function() {
            var a = this;
            if (a.els.sizeSelect && a.els.quantitySelect) {
                a.els.quantitySelect.selectedindex = 0;
                a.els.quantitySelect.selectBox("value", "1");
                if (!a.isOnlyOneInStock) {
                    a.els.sizeSelect.selectedindex = -1;
                    a.els.sizeSelect.selectBox("value", "");
                    a.els.sizeSelect.parent().find(".js-selectBox-label").show()
                }
                nike.dispatchEvent(nike.gadget.Event.QUANTITY_CHANGED, {
                    element: a.els.quantitySelect,
                    quantity: "1"
                })
            }
        },
        setSizeValid: function(g, f, c) {
            var a = this;
            var e = (c) ? c : a.els.sizeSelect;
            var d = (c) ? g.find(a.settings.selectors.buyingTools.fakeSizeSelect) : a.els.fakeSizeSelect;
            if (e.length) {
                if (f) {
                    e.removeClass(a.settings.classes.invalid);
                    d.removeClass(a.settings.classes.invalid)
                } else {
                    e.addClass(a.settings.classes.invalid);
                    d.addClass(a.settings.classes.invalid)
                }
                if (!c) {
                    var b = new nike.exp.pdp.PdpToolTip({
                        classes: {
                            tooltip: a.settings.classes.sizeToolTip,
                            tooltipText: "nsg-font-family--base"
                        },
                        offset: {
                            y: 1
                        },
                        parent: e,
                        tipText: a.settings.content.sizeToolTipText,
                        qaAttr: a.settings.content.sizeToolTipQAAttr
                    });
                    if (!f) {
                        b.addToolTip()
                    } else {
                        b.removeToolTip()
                    }
                }
                e.on("change", function() {
                    d.removeClass(a.settings.classes.invalid).removeClass(nike.style.nsg.Classes.INVALID);
                    if (b) {
                        b.removeToolTip()
                    }
                })
            }
        },
        validateAddTo: function(c, a, e) {
            var b = true;
            var d = c.find(a);
            if (d.length) {
                if (d.find("option:selected").val().length === 0) {
                    this.setSizeValid(c, false);
                    b = false
                } else {
                    this.setSizeValid(c, true)
                }
            } else {
                this.setSizeValid(c, true)
            }
            if (!b && e) {
                nike.dispatchEvent(nike.gadget.Event.SAVE_TO_LOCKER_INVALID, {
                    missing: "size",
                    data: {},
                    element: c
                })
            }
            return b
        },
        addSizeSelectListener: function() {
            $(this.settings.selectors.buyingTools.sizeSelect).on("change", this.handleSizeSelectChange)
        },
        handleSizeSelectChange: function(c) {
            var g = $(c.currentTarget);
            var b = g.parent().find(".js-selectBox-label");
            var f = g.parent().find(".js-selectBox-value");
            var d = g.find("option:selected").text().trim();
            if (d.length > 4) {
                var a = f.text().match(/^\((.*?)\)$/);
                b.hide();
                if (a && a[1]) {
                    f.text(a[1])
                }
            } else {
                b.show()
            }
            if (!g.hasClass("exp-pdp-size-not-in-stock")) {
                nike.dispatchEvent(nike.Event.SIZE_SELECTION_SELECTED, {
                    selectedSize: d
                })
            }
        },
        initializeUserProfile: function(c) {
            var a = this;
            var b = nike.exp.profile.ProfileStateController.requireState(nike.exp.profile.PROFILE_STATE.USER_LOADED);
            b.done(function() {
                a.baseUserData = nike.exp.profile.ProfileStateController.getUserState();
                if (a.baseUserData.loggedIn) {
                    a.fullUserData = nike.exp.profile.ProfileStateController.getUserData()
                }
                if (c != undefined) {
                    c()
                }
            }).fail(function() {
                a.baseUserData = {
                    loggedIn: false
                };
                if (c != undefined) {
                    c()
                }
            })
        },
        setupNotifyMeModal: function() {
            var b = this;
            b.initializeUserProfile();
            var a = $(b.settings.selectors.notifyMe.modal);
            var c = new nike.exp.global.Form(a.find(b.settings.selectors.notifyMe.form));
            c.extraNotifierClass = "nsg-form--tool-tip";
            if (typeof b.els.notifyMeModal === "undefined") {
                b.els.notifyMeModal = new nike.exp.global.Modal({
                    $content: a,
                    blockerClickCloses: false,
                    autoDestroy: false,
                    selectorClass: "notify-me-modal-container",
                    onClose: function() {
                        b.resetNotifyMe(c, a)
                    }
                });
                if (nike.exp.script.device_detect.isMobile()) {
                    $(document).on("nsgReady", function() {
                        c.attachListeners()
                    })
                } else {
                    c.attachListeners()
                }
            }
            $(b.settings.selectors.notifyMe.link).on("click.pdp touch.pdp", function(d) {
                d.preventDefault();
                d.stopPropagation();
                b.initializeUserProfile(function() {
                    if (b.baseUserData && b.baseUserData.loggedIn && b.fullUserData) {
                        a.find('[name="firstname"]').val(b.fullUserData.firstName);
                        a.find('[name="lastname"]').val(b.fullUserData.lastName);
                        a.find('[name="email"]').val(b.fullUserData.account.attributes.email);
                        a.find(".not-me").removeClass("not-logged-in").find(".user-name").text(b.fullUserData.account.attributes.screenName);
                        a.find(".not-me").on("click", function(i) {
                            i.preventDefault();
                            i.stopImmediatePropagation();
                            var h = $(this);
                            c.clearForm();
                            h.addClass("not-logged-in").find(".user-name").empty();
                            nike.exp.profile.ProfileStateController.logout()
                        })
                    }
                    nike.dispatchEvent(nike.gadget.Event.SHOW_NOTIFY_ME, {
                        isComingSoon: b.settings.data.currentProduct.showComingSoonMessage
                    });
                    if (nike.exp.script.device_detect.isMobile()) {
                        var f = a.find(".exp-pdp-size-dropdown");
                        var e = a.find(".nsg-form--drop-down--selected-option");

                        function g() {
                            var h = f.find("option:selected");
                            return h.data("label") || h.text() || "\u00a0"
                        }
                        if (!f.data("events")) {
                            f.on("change.notifyme_size_select", function() {
                                e.text(g())
                            })
                        } else {
                            e.text(g())
                        }
                    }
                    nike.SiteIdUtil.getDefaultSiteId(function(h) {
                        b.els.notifyMeModal.$content.find('#notify-me-form [name="siteid"]').val(h)
                    }, "html");
                    b.els.notifyMeModal.open()
                })
            });
            c.onSubmit = $.proxy(b.submitNotifyMe, {
                bT: b,
                body: a,
                form: c
            });
            c.onFailedFormValidation = $.proxy(b.notifyMeFailedValidation, {
                bT: b,
                body: a,
                form: c
            });
            a.find(".continue-shopping-button").on("click", function() {
                b.resetNotifyMe(c, a);
                b.els.notifyMeModal.close()
            })
        },
        resetNotifyMe: function(c, a) {
            var b = this;
            c.clearForm();
            c.formEl.find(".exp-tooltip").remove();
            c.formEl.find("." + b.settings.classes.invalid).removeClass(b.settings.classes.invalid);
            c.formEl.find(".not-me").addClass("not-logged-in").find(".user-name").empty();
            a.find(".notify-success, .notify-error").hide();
            a.find(".notify-main-content").show();
            a.find(".js-selectBox-label").show()
        },
        notifyMeFailedValidation: function() {
            var b = this.bT;
            var a = this.body;
            var c = this.form;
            var d = a.find("select.exp-pdp-size-dropdown");
            c.formEl.find("input." + nike.style.nsg.Classes.INVALID + ", .selectBox-dropdown." + nike.style.nsg.Classes.INVALID).on("mouseover", function() {
                var f = $(this);
                var e = (f.hasClass("selectBox-dropdown")) ? f.parent().parent() : f.parent();
                e.find(".notifier").addClass("visible")
            }).on("mouseout", function() {
                var f = $(this);
                var e = (f.hasClass("selectBox-dropdown")) ? f.parent().parent() : f.parent();
                e.find(".notifier").removeClass("visible")
            });
            if (d.hasClass(nike.style.nsg.Classes.INVALID)) {
                b.setSizeValid(c.formEl, false, d)
            }
        },
        submitNotifyMe: function() {
            var b = this.bT;
            var a = this.body;
            var f = this.form;
            var d = a.find('[name="email"]').val();
            nike.dispatchEvent(nike.gadget.Event.NOTIFY_ME_SUBMIT_CLICK, {});
            var g = a.find("select.exp-pdp-size-dropdown");
            var e = g.val().split(":");
            f.formEl.find('[name="skuid"]').val(e[0]);
            if (e[1]) {
                f.formEl.find('[name="itemsize"]').val(e[1])
            }
            var c = b.serializeToObject(f.formEl);
            c.rt = "json";
            delete c.sizetype;
            nike.request({
                type: "POST",
                url: nike.getServiceUrl("notifyMeService"),
                data: c
            }, function(h) {
                ($.parseJSON(h.data).status === "success") ? b.notifyMeSuccess(a, d): b.notifyMeError(a)
            }, function() {
                b.notifyMeError(a)
            })
        },
        notifyMeSuccess: function(b, c) {
            var d = b.find(".notify-success");
            var a = d.find(".text");
            b.find(".notify-main-content").hide();
            d.show();
            a.html(a.data("successtext").replace(/\{0\}/i, c));
            nike.dispatchEvent(nike.gadget.Event.NOTIFY_ME_SUCCESS, {})
        },
        notifyMeError: function(a) {
            a.find(".notify-main-content").hide();
            a.find(".notify-error").show()
        },
        serializeToObject: function(c) {
            var d = {};
            var b = c.serializeArray();
            $.each(b, function() {
                if (d[this.name] !== undefined) {
                    if (!d[this.name].push) {
                        d[this.name] = [d[this.name]]
                    }
                    d[this.name].push(this.value || "")
                } else {
                    d[this.name] = this.value || ""
                }
            });
            return d
        }
    };
} catch (ex) {
    if (nike.error) {
        nike.error('An unhandled exception was thrown while executing nike.exp.pdp.PdpBuyingTools. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
    }
}
