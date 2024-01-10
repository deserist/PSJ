var shm = shm || {};
shm.dialog = {
    success: function (dialogMessage, dialogEventName) {
        shm.dialog.showInfo(dialogMessage, dialogEventName, "/pasaj_static_lib/assets/images/mobile/content/global/confirmation.png", "width: %100; max-width: 350px;")
    },
    error: function (dialogMessage, dialogEventName) {
        shm.dialog.showInfo(dialogMessage, dialogEventName, "/pasaj_static_lib/assets/images/mobile/my_account/campaign/icon-confirm_large.png", "width: 100%; max-width: 200px;")
    },
    close: function (popupName) {
        container = shm.dialog.differentContainer ? shm.dialog.differentContainer : "mainPage";
        shm.popup.close(popupName, container)
    },
    showInfo: function (dialogMessage, dialogEventName, imagePath, imageStyle) {
        shm.dialog.hideOthers();
        if (!dialogEventName) {
            dialogEventName = 'shm.dialog.close("mobile-information-popup")'
        }
        $("#mobile-information-popup-ok").attr("onClick", dialogEventName);
        $("#mobile-information-popup-message").html(dialogMessage);
        $("#mobile-information-popup-message").attr("style", "font-size:16px !important;margin:0 auto; word-wrap: break-word;");
        $("#mobile-information-popup-image").attr("src", $("#siteAssetsDomain").html() + imagePath);
        $("#mobile-information-popup-image").attr("style", imageStyle);
        $("#mobile-information-popup").show()
    },
    confirmation: function (dialogQuestionMessage, dialogDescMessage, dialogDescDetailMessage, dialogYesEventName, dialogNoEventName) {
        shm.dialog.hideOthers();
        $("#mobile-confirmation-popup").show();
        shm.popup.close("mainPage", "mobile-confirmation-popup");
        if (!dialogYesEventName) {
            dialogYesEventName = 'shm.dialog.close("mobile-confirmation-popup")'
        }
        $("#mobile-confirmation-popup-yes").attr("onClick", dialogYesEventName);
        $("#mobile-confirmation-popup-no").attr("onClick", dialogNoEventName);
        $("#mobile-confirmation-popup-question-message").html(dialogQuestionMessage);
        $("#mobile-confirmation-popup-question-message").attr("style", "font-size:16px !important;margin:0 auto; word-wrap: break-word;");
        $("#mobile-confirmation-popup-desc-message").attr("style", "font-size:16px !important;margin:0 auto;word-wrap: break-word;");
        $("#mobile-confirmation-popup-desc-message").html(dialogDescMessage);
        $("#mobile-confirmation-popup-desc-detail-message").html(dialogDescDetailMessage);
        if($("body").scrollTop() != 0){
        	$("body").animate({scrollTop: 0}, 200);
        }
    },
    confirmationWithButtonLabel: function (dialogQuestionMessage, dialogDescMessage, dialogDescDetailMessage, dialogYesEventName, dialogNoEventName, dialogYesButtonLabel, dialogNoButtonLabel) {
        shm.dialog.hideOthers();
        $("#mobile-confirmation-popup").show();
        shm.popup.close("mainPage", "mobile-confirmation-popup");
        if (!dialogYesEventName) {
            dialogYesEventName = 'shm.dialog.close("mobile-confirmation-popup")'
        }
        $("#mobile-confirmation-popup-yes").attr("onClick", dialogYesEventName);
        $("#mobile-confirmation-popup-no").attr("onClick", dialogNoEventName);
        $("#mobile-confirmation-popup-yes").html(dialogYesButtonLabel);
        $("#mobile-confirmation-popup-no").html(dialogNoButtonLabel);
        $("#mobile-confirmation-popup-question-message").html(dialogQuestionMessage);
        $("#mobile-confirmation-popup-question-message").attr("style", "font-size:16px !important;margin:0 auto; word-wrap: break-word;");
        $("#mobile-confirmation-popup-desc-message").html(dialogDescMessage);
        $("#mobile-confirmation-popup-desc-message").attr("style", "font-size:16px !important;margin:0 auto;word-wrap: break-word;");
        $("#mobile-confirmation-popup-desc-detail-message").html(dialogDescDetailMessage)
    },
    confirmationWithButtonLabelAndImage: function (dialogQuestionMessage, dialogDescMessage, dialogDescDetailMessage, dialogYesEventName, dialogNoEventName, dialogYesButtonLabel, dialogNoButtonLabel, dialogImageUrl) {
        shm.dialog.hideOthers();
        $("#mobile-confirmation-popup").show();
        shm.popup.close("mainPage", "mobile-confirmation-popup");
        if (!dialogYesEventName) {
            dialogYesEventName = 'shm.dialog.close("mobile-confirmation-popup")'
        }
        $("#mobile-confirmation-popup-yes").attr("onClick", dialogYesEventName);
        $("#mobile-confirmation-popup-no").attr("onClick", dialogNoEventName);
        $("#mobile-confirmation-popup div.lightbox__content img").attr("src", dialogImageUrl);
        $("#mobile-confirmation-popup-yes").html(dialogYesButtonLabel);
        $("#mobile-confirmation-popup-no").html(dialogNoButtonLabel);
        $("#mobile-confirmation-popup-question-message").html(dialogQuestionMessage);
        $("#mobile-confirmation-popup-question-message").attr("style", "font-size:16px !important;margin:0 auto; word-wrap: break-word;");
        $("#mobile-confirmation-popup-desc-message").html(dialogDescMessage);
        $("#mobile-confirmation-popup-desc-message").attr("style", "font-size:16px !important;margin:0 auto;word-wrap: break-word;");
        $("#mobile-confirmation-popup-desc-detail-message").html(dialogDescDetailMessage)
    },
    hideOthers: function () {
        container = shm.dialog.differentContainer ? shm.dialog.differentContainer : "mainPage";
        $(".black_overlay").hide();
        $("#" + container).hide();
        $("#mobile-confirmation-popup").hide();
        if(container == "mainPage"){
            $("#mainWrapper").hide();
        }
    }
};
shm.overlay = {
    show: function () {
        $(".black_overlay").show()
    },
    hide: function () {
        $(".black_overlay").hide()
    }
};
shm.util = shm.util || {
    isEmpty: function (value) {
        return (value == "undefined" || value == null || value == "")
    },
    checkBoxChanged: function (formId) {
        if ($("#" + formId + ' input[type="checkbox"]').attr("checked")) {
            $("#" + formId + " .checked").show();
            $("#" + formId + " .unchecked").hide()
        } else {
            $("#" + formId + " .checked").hide();
            $("#" + formId + " .unchecked").show()
        }
    },
    checkBoxChangedWithId: function (formId, checkboxId) {
        if ($("#" + formId + " #" + checkboxId).attr("checked")) {
            $("#" + formId + " #" + checkboxId + "Div .checked").show();
            $("#" + formId + " #" + checkboxId + "Div .unchecked").hide()
        } else {
            $("#" + formId + " #" + checkboxId + "Div .checked").hide();
            $("#" + formId + " #" + checkboxId + "Div .unchecked").show()
        }
    },
    getRenditionImages: function () {
        var allImages = $("img");
        for (var i = 0; i < allImages.length; i++) {
            if ($(allImages[i]).data("height") != undefined && $(allImages[i]).data("width") != undefined && $(allImages[i]).data("src") != undefined && shm.util.validate.imageUrlValidate($(allImages[i]).data("src"))) {
                var changedPath = shm.util.getRenditionImage($(allImages[i]).data("src"), $(allImages[i]).data("height"), $(allImages[i]).data("width"));
                $(allImages[i]).attr("src", changedPath)
            }
        }
    },
    getRenditionImage: function (path, height, width) {
        var filename = path.substring(path.lastIndexOf("/") + 1);
        var extension = filename.substring(filename.lastIndexOf(".") + 1);
        var filenameWithoutExtension = filename.substring(0, filename.lastIndexOf("."));
        path = path.substring(0, path.lastIndexOf(filename));
        return (path + filenameWithoutExtension + "%20Rendition/" + filenameWithoutExtension + "_" + width + "x" + height + "." + extension)
    },
    redirectPostfix: function (psx) {
        if (window.location.href.indexOf(psx) < 0) {
            window.location.href = psx
        }
    },
    customerType: function () {
        return window.location.href.indexOf("kurumsal") < 0 ? "Individual" : "Corporate"
    },
    updateQueryString: function (key, value, url) {
        if (!url) {
            url = window.location.href
        }
        var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");
        if (re.test(url)) {
            if (typeof value !== "undefined" && value !== null) {
                return url.replace(re, "$1" + key + "=" + value + "$2$3")
            } else {
                return url.replace(re, "$1$3").replace(/(&|\?)$/, "")
            }
        } else {
            if (typeof value !== "undefined" && value !== null) {
                var separator = url.indexOf("?") !== -1 ? "&" : "?",
                    hash = url.split("#");
                url = hash[0] + separator + key + "=" + value;
                if (hash[1]) {
                    url += "#" + hash[1]
                }
                return url
            } else {
                return url
            }
        }
    },
    removeVariableFromURL: function (url_string, variable_name) {
        var URL = String(url_string);
        var regex = new RegExp("\\?" + variable_name + "=[^&]*&?", "gi");
        URL = URL.replace(regex, "?");
        regex = new RegExp("\\&" + variable_name + "=[^&]*&?", "gi");
        URL = URL.replace(regex, "&");
        URL = URL.replace(/(\?|&)$/, "");
        regex = null;
        return URL
    },
    sliderChangeEvent: function (inputId, labelId) {
        var quotaText = null;
        var quotaTypeText = $("#" + labelId).next("span");
        if (parseFloat($("#" + inputId).attr("value")) % 1 == 0) {
            quotaText = parseFloat($("#" + inputId).attr("value"));
        } else {
            quotaText = parseFloat($("#" + inputId).attr("value")).toFixed(1);
        }
        if(quotaTypeText == "GB" || quotaTypeText == "MB"){
	        if(quotaText < 1){
	        	quotaText = quotaText * 1000;
	        	$("#" + labelId).next("span").text("MB")
	        }else{
	        	$("#" + labelId).next("span").text("GB")
	        }
        }
        quotaText = quotaText.toString().replace(".",",");
        $("#" + labelId).text(quotaText)
    },
    shortenText: function (targetsToShorten, shorteningAmount) {
        for (var j = 0; j < targetsToShorten.length; j++) {
            var inputTextToCharArray = targetsToShorten[j].innerHTML;
            if (inputTextToCharArray.length >= shorteningAmount) {
                var stringToBeReturned = "";
                for (var i = 0; i < shorteningAmount - 3; i++) {
                    stringToBeReturned += inputTextToCharArray[i]
                }
                stringToBeReturned += "...";
                targetsToShorten[j].innerHTML = stringToBeReturned
            }
        }
    }
};
shm.ajax = {
    get: function (urlText, dataTypeText, parentPageId, childPageId, isOverlayRequested, beforeCall, successCall, errorCall, isAppendRequested, appendContent, appendId, afterSuccessCall) {
        $.ajax({
            type: "GET",
            headers: {
                "X-Tcell-Ajax": "true"
            },
            url: urlText,
            dataType: dataTypeText,
            beforeSend: beforeCall || function () {
                if (isOverlayRequested) {
                    $(".black_overlay").show()
                }
            },
            success: successCall || function (data) {
                shm.ajax.successDefault(data, parentPageId, childPageId, isOverlayRequested);
                if (isAppendRequested) {
                    $("#" + appendId).append(appendContent)
                }
                if (afterSuccessCall) {
                    afterSuccessCall()
                }
            },
            error: errorCall || function (jqXhr, textStaus, errorThrown) {
                shm.dialog.error(jqXhr.responseText)
            }
        })
    },
    getWithoutPopup: function (urlText, dataTypeText, beforeCall, successCall, errorCall) {
        $.ajax({
            type: "GET",
            headers: {
                "X-Tcell-Ajax": "true"
            },
            url: urlText,
            dataType: dataTypeText,
            beforeSend: beforeCall,
            success: successCall,
            error: errorCall
        })
    },
    successDefault: function (data, parentPageId, childPageId, isOverlayRequested) {
        var parent = $("#" + parentPageId);
        if (isOverlayRequested) {
            $(".black_overlay").hide()
        }
        var myDiv = $("<div/>").html(data).appendTo(parent);
        myDiv.attr("id", childPageId);
        parent.hide();
        parent.after(myDiv)
    },
    go: function (cfg) {
        $.ajax({
            type: cfg.type || "GET",
            headers: {
                "X-Tcell-Ajax": "true"
            },
            dataType: cfg.dataType || "html",
            url: cfg.url,
            data: cfg.data,
            beforeSend: function () {
                if (cfg.loaderRequested) {
                    $("#selector-div").hide();
                    $("#loading-image-div").show()
                }
            },
            success: function (data, status, xhr) {
                if (data) {
                    if (cfg.replacedSelector) {
                        var replaced = $(cfg.replacedSelector),
                            $data = $(data),
                            response = $();
                        if (cfg.responseSelector) {
                            response = $data.find(cfg.responseSelector);
                            response = $.merge($data.filter(cfg.responseSelector), response);
                            replaced.each(function (index, item) {
                                $(item).replaceWith(response.eq(index))
                            })
                        } else {
                            replaced.replaceWith($data);
                            replaced.remove()
                        }
                    }
                }
                if (typeof cfg.success == "function") {
                    cfg.success.call(this, data, status, xhr)
                }
            },
            complete: cfg.complete || function () {
                if (cfg.loaderRequested) {
                    $("#loading-image-div").hide();
                    $("#selector-div").show()
                }
            },
            error: cfg.error
        })
    }
};
shm.popup = {
    close: function (toBeHided, toBeShown) {
        $("#" + toBeHided).hide();
        if(toBeShown == "mainPage") {
        	  $("#mainWrapper").show();
        }
        $("#" + toBeShown).show()
    }
};
shm.regex = {
    emailCheck: function (toBeChecked) {
        var reEmail = /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        return reEmail.test(toBeChecked)
    }
};
shm.form = {
    preventSubmit: function (formId) {
        $("form[id=" + formId + "]").bind("keypress", function (e) {
            if (e.keyCode == 13) {
                return false
            }
        })
    }
};
shm.util.validate = {
    imageUrlValidate: function (imageUrl) {
        return (imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null)
    },
    submit: function (formId) {
        $("form[id=" + formId + "]").validate().cancelSubmit = true;
        $("form[id=" + formId + "]").submit()
    },
    checkBoxValidate: function (formId, fieldName, errorMessage, errorContainer) {
        var rule = {
            required: {
                depends: function (element) {
                    return $("#" + formId + ' input[type="checkbox"]:checked')
                }
            }
        };
        var message = {
            required: errorMessage
        };
        shm.util.validate.check(formId, fieldName, rule, message, errorContainer);
        shm.util.checkBoxChanged(formId);
        return shm.util.validate.getResult(formId)
    },
    dropDownValidate: function (formId, fieldName, errorMessage, errorContainer) {
        var rule = {
            required: {
                depends: function (element) {
                    return $("#" + formId + " " + fieldName + " option:selected").attr("value") == ""
                }
            }
        };
        var message = {
            required: errorMessage
        };
        shm.util.validate.check(formId, fieldName, rule, message, errorContainer);
        return shm.util.validate.getResult(formId)
    },
    multipleCheckBoxValidate: function (formId, fieldName, errorMessage, errorContainer) {
        var rule = {
            required: {
                depends: function (element) {
                    return !($("#" + formId + ' input[type="checkbox"]:checked').length > 0)
                }
            }
        };
        var message = {
            required: errorMessage
        };
        shm.util.validate.check(formId, fieldName, rule, message, errorContainer);
        shm.util.checkBoxChanged(formId);
        return shm.util.validate.getResult(formId)
    },
    emailValidate: function (formId, fieldName, requiredErrorMessage, regexErrorMessage, errorContainer) {
        var rule = {
            required: true,
            email: true
        };
        var message = {
            required: requiredErrorMessage,
            email: regexErrorMessage
        };
        shm.util.validate.check(formId, fieldName, rule, message, errorContainer);
        shm.util.checkBoxChanged(formId);
        return shm.util.validate.getResult(formId)
    },
    emailValidateWithoutRequired: function (formId, fieldName, regexErrorMessage, errorContainer) {
        var rule = {
            email: true
        };
        var message = {
            email: regexErrorMessage
        };
        shm.util.validate.check(formId, fieldName, rule, message, errorContainer);
        shm.util.checkBoxChanged(formId);
        return shm.util.validate.getResult(formId)
    },
    isEmptyField: function (formId, fieldName, requiredErrorMessage, errorContainer) {
        shm.util.validate.check(formId, fieldName, {
            required: true
        }, {
            required: requiredErrorMessage
        }, errorContainer);
        return shm.util.validate.getResult(formId)
    },
    checkLenght: function (formId, fieldName, message, lenght, errorContainer) {
        shm.util.validate.check(formId, fieldName, {
            minlength: lenght,
            maxlength: lenght
        }, {
            minlength: message,
            maxlength: message
        }, errorContainer);
        return shm.util.validate.getResult(formId)
    },
    checkInterval: function (formId, fieldName, minMessage, maxMessage, minLenght, maxLenght, errorContainer) {
        shm.util.validate.check(formId, fieldName, {
            minlength: minLenght,
            maxlength: maxLenght
        }, {
            minlength: minMessage,
            maxlength: maxMessage
        }, errorContainer);
        return shm.util.validate.getResult(formId)
    },
    isNumeric: function (formId, fieldName, message, errorContainer) {
        shm.util.validate.check(formId, fieldName, {
            number: true
        }, {
            number: message
        }, errorContainer);
        return shm.util.validate.getResult(formId)
    },
    isAlphabetical: function (formId, fieldName, message, errorContainer) {
        shm.util.validate.check(formId, fieldName, {
            lettersonly: true
        }, {
            lettersonly: message
        }, errorContainer);
        return shm.util.validate.getResult(formId)
    },
    msisdnLastTwoValidate: function (formId, fieldName, requiredErrorMessage, errorContainer) {
        var rule = {
            required: true,
            minlength: 2,
            maxlength: 2,
            number: true
        };
        var message = {
            required: requiredErrorMessage,
            minlength: requiredErrorMessage,
            maxlength: requiredErrorMessage,
            number: requiredErrorMessage
        };
        shm.util.validate.check(formId, fieldName, rule, message, errorContainer);
        shm.util.checkBoxChanged(formId);
        return shm.util.validate.getResult(formId)
    },
    check: function (formId, fieldName, rule, message, errorContainer) {
        var rules = new Object();
        var messages = new Object();
        rules[fieldName] = rule;
        messages[fieldName] = message;
        $.removeData($("#" + formId)[0], "validator");
        if (errorContainer != undefined) {
            $("#" + formId).validate({
                rules: rules,
                messages: messages,
                errorLabelContainer: "#" + errorContainer
            })
        } else {
            $("#" + formId).validate({
                rules: rules,
                messages: messages
            })
        }
    },
    getResult: function (formId) {
        var result = $("#" + formId).valid();
        if (result) {
            $.removeData($("#" + formId)[0], "validator")
        }
        return result
    },
    isValidEmailAddressEmptyOk: function (emailAddress) {
    	if(emailAddress!=undefined  && $.trim(emailAddress).length!=0 ){
            var pattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
            return pattern.test(emailAddress);
        }
        else{
            return true;
        }
    }
};
shm.slider = {
    findNearestPoint: function (value, limitValues) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < limitValues.length; i++) {
            var newDiff = Math.abs(value - limitValues[i]);
            if (diff == null || newDiff < diff) {
                nearest = limitValues[i];
                diff = newDiff
            }
        }
        return nearest
    }
};

function getUrlVars(key) {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    var count = 0;
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split("=");
        if (key === hash[0]) {
            vars[count] = hash[1];
            count++
        }
    }
    return vars.length > 1 ? vars : vars[0]
}

function dateToyyyyMMddFormatString(date) {
    day = date.getDate();
    month = date.getMonth() + 1;
    if (day < 10) {
        day = "0" + day
    }
    if (month < 10) {
        month = "0" + month
    }
    return "" + date.getFullYear() + month + date.getDate()
}
function replaceAll(find, replace, str) 
{
  while( str.indexOf(find) > -1)
  {
	str = str.replace(find, replace);
  }
  return str;
}
shm.sort = {
    sort: function (id, element, orderType, dataKey, isAlphabetic) {
        data = {
            data: dataKey,
            order: orderType
        };
        if (isAlphabetic) {
            data.charOrder = "AaBbCcÇçDdEeFfGgĞğHhIıİiJjKkLlMmNnOoÖöPpRrSsŞşTtUuÜüVvYyZz"
        }
        $("div#" + id + " ." + element).tsort(data)
    }
};
shm.switchUser = {
    info: function () {
        var linetype = $(this).data("linetype");
        var msisdn = $(this).data("msisdn");
        if (!(linetype == null && msisdn == null)) {
            if ($("#currentMsisdn").data("currentMsisdn") !== msisdn) {
                $("#loading-image-div").show();
                $("#this_page").val(location.pathname);
                $("#user_swith_form").attr("action", "/hesabim/degistir/" + msisdn);
                $("#user_swith_form").submit()
            }
        }
    }
};
shm.hash = {
    onhashchange: function (filterPageId, mainPageId) {
        $(window).bind("hashchange", function (e) {
            if (window.location.hash.split("#")[1] == "" || window.location.hash.split("#")[1] == undefined) {
                shm.popup.close(filterPageId, mainPageId)
            }
        })
    }
};
shm.crossdomain = {
    clickEvent: function (event, cfg) {
        event.preventDefault();
        var whiteListed = false;
        var whiteListArray = cfg.whiteList.split(";");
        var parser = document.createElement("a");
        parser.href = cfg.href;
        var urlToControl = parser.protocol + "//" + parser.host;
        for (var i = 0; i < whiteListArray.length; i++) {
            if (whiteListArray[i].length > 3 && (urlToControl).indexOf(whiteListArray[i]) >= 0) {
                whiteListed = true;
                break
            }
        }
        if ((urlToControl).indexOf(window.location.host) >= 0) {
            whiteListed = true
        }
        shm.dialog.confirmation(cfg.question, cfg.desc, cfg.descDetail, cfg.yesEvent, cfg.noEvent);
        if (whiteListed) {
            $("#mobile-confirmation-popup-yes").trigger("click")
        } else {
            $.ajax({
                type: "GET",
                url: "/paket-ve-tarifeler/wifi-or-3g.json",
                beforeSend: function () {
                    $(".black_overlay").show()
                },
                success: function (pageResponse, status, xhr) {
                    if (pageResponse.status === "WIFI") {
                        $("#mobile-confirmation-popup-yes").trigger("click")
                    }
                },
                complete: function () {
                    $(".black_overlay").hide()
                },
                error: function (jqXhr, textStaus, errorThrown) {}
            })
        }
    },
    yesEvent: function (href, target) {
        $("#mobile-confirmation-popup-yes").attr("href", href);
        $("#mobile-confirmation-popup").hide();
        $("#mainPage").show();
        $("#mainWrapper").show();
        window.location = href;
    },
    noEvent: function noEvent() {
        $("#mobile-confirmation-popup").hide();
        $("#mainPage").show();
        $("#mainWrapper").show();
    }
};
shm.scroll = {
    animate: function (id) {
        id = id.replace("link", "");
        $("html,body").animate({
            scrollTop: $("#" + id).offset().top
        }, "slow")
    }
};
shm.url = {
    add: function (sourceUrl, parameterName, parameterValue, replaceDuplicates) {
        if ((sourceUrl == null) || (sourceUrl.length == 0)) {
            sourceUrl = document.location.href
        }
        var urlParts = sourceUrl.split("?");
        var newQueryString = "";
        if (urlParts.length > 1) {
            var parameters = urlParts[1].split("&");
            for (var i = 0;
                (i < parameters.length); i++) {
                var parameterParts = parameters[i].split("=");
                if (!(replaceDuplicates && parameterParts[0] == parameterName)) {
                    if (newQueryString == "") {
                        newQueryString = "?"
                    } else {
                        newQueryString += "&"
                    }
                    newQueryString += parameterParts[0] + "=" + parameterParts[1]
                }
            }
        }
        if (newQueryString == "") {
            newQueryString = "?"
        } else {
            newQueryString += "&"
        }
        newQueryString += parameterName + "=" + parameterValue;
        return urlParts[0] + newQueryString
    }
};
shm.button = {
	activateLoading : function(id){
		var item = $(id);
			
		if(item.length > 1){
			var loadingText = $(id).data("loading-text");
				for(var i = 0; i<item.length; i++){
					$(item[i]).data("original-text",$(item[i]).text());
					$(item[i]).text("");
					$(item[i]).append('<span class="loading-btn">'+loadingText+'</span>');
				}
		}else{
			var loadingText = $(id).data("loading-text");
			item.data("original-text",item.text());
			item.text("");
			item.append('<span class="loading-btn">'+loadingText+'</span>');
		}
		
	},
	deactivateLoading: function(id){
		var item = $(id);
		item.text(item.data("original-text"));
	}
};
shm.getAndroidVersion = function(){
	var ua = ua || navigator.userAgent; 
    var match = ua.match(/Android\s([0-9\.]*)/);
    return match ? match[1] : false;
};
shm.hideBasedOnOS = function(){
	var ios = $(".show-ios"),
		android = $(".show-android"),
		windowsPhone = $(".show-winphone");
	
	ios.hide();
	android.hide()
	windowsPhone.hide();
	
	if (navigator.userAgent.match(/(iPod|iPhone|iPad)/i)) {
	    ios.show();
	}
	
	if(navigator.userAgent.match(/(Android)/i)){
		android.show();
	}
	
	if(navigator.userAgent.match(/(Windows Phone)/i)){
		windowsPhone.show();
	}
	
};
shm.hideBasedOnOS();

shm.is = {
	deviceIOS : function(){
		return navigator.userAgent.match(/(iPod|iPhone|iPad)/i);
	},
	deviceAndroid : function(){
		return navigator.userAgent.match(/(Android)/i);
	},
	deviceWindowsPhone : function(){
		return navigator.userAgent.match(/(Windows Phone)/i);
	}
};

shm.shareEmail = function(){
	var title = $("title").text(),
		url = location.href,
		shareEmail = $(".share-email");
	shareEmail.attr("href","mailto:E-posta Adresi Girin?subject="+title+"&body="+url);
};
shm.restricts = function(){
	$(".input_restrict_letter").on("textchange keyup", function(e) {
        var $input = $(this),
            invalid_chars_regexp = /[^a-zA-ZöÖçÇşŞıİğĞüÜ ]+/g;

        //remove extra chars
        if (invalid_chars_regexp.test($input.val())) {
            $input.val($input.val().replace(invalid_chars_regexp, ''));
        }
    });
	$(".input_restrict_letter_no_turkish").on("textchange keyup", function(e) {
        var $input = $(this),
            invalid_chars_regexp = /[öÖçÇşŞıİğĞüÜ]/g;

        //remove extra chars
		 if (invalid_chars_regexp.test($input.val())) {
			$input.val($input.val().replace(invalid_chars_regexp, ''));
		 }
    });
	$(".input_restrict_decimal").on("textchange keyup", function(e) {
        var $input = $(this),
            invalid_chars_regexp = /[^0-9]+/g;
        if (invalid_chars_regexp.test($input.val())) {
            $input.val($input.val().replace(invalid_chars_regexp, ''));
        }
    });
	$(".input_restrict_zero_start").on("textchange keyup", function(e) {
		 var input = $(this);
		 input.val(input.val().replace(/^(0)(.*)/g, "$2"));
    });
	$(".input_restrict_bill_address").on("textchange keyup", function(e) {
        var $input = $(this),
            invalid_chars_regexp = /[^0-9a-zA-ZöÖçÇşŞıİğĞüÜ/\.\- ]+/g;

        //remove extra chars
        if (invalid_chars_regexp.test($input.val())) {
            $input.val($input.val().replace(invalid_chars_regexp, ''));
        }
    });
	$(".input_restrict_avenue_street").on("textchange keyup", function(e) {
		var $input = $(this),
         	invalid_chars_regexp = /[^0-9a-zA-ZöÖçÇşŞıİğĞüÜ\.\s]+/g;
         
        //remove extra chars
        if (invalid_chars_regexp.test($input.val())) {
            $input.val($input.val().replace(invalid_chars_regexp, ''));
        }
    });
	$(".input_no_space").on("textchange keyup", function(e) {
        var $input = $(this),
            space_entry_regexp = / /g;

        //remove extra chars
        if (space_entry_regexp.test($input.val())) {
            $input.val($input.val().replace(space_entry_regexp, ''));
        }
    });
};
shm.restricts();
shm.accordion = {
	activateLoading : function(id){
		var item = $(id);
		item.prepend('<i class="accordion-loader"></i>');
	},
	deactivateLoading : function(id){
		var item = $(id);
		item.children("i.accordion-loader").remove();
	}
};
String.prototype.toUpperCaseTR = function () {
    var str = [];
    for (var i = 0; i < this.length; i++) {
        var ch = this.charCodeAt(i);
        var c = this.charAt(i);
        if (ch == 105) {
            str.push("İ")
        } else {
            if (ch == 305) {
                str.push("I")
            } else {
                if (ch == 287) {
                    str.push("Ğ")
                } else {
                    if (ch == 252) {
                        str.push("Ü")
                    } else {
                        if (ch == 351) {
                            str.push("Ş")
                        } else {
                            if (ch == 246) {
                                str.push("Ö")
                            } else {
                                if (ch == 231) {
                                    str.push("Ç")
                                } else {
                                    if (ch >= 97 && ch <= 122) {
                                        str.push(c.toUpperCase())
                                    } else {
                                        str.push(c)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return str.join("")
};
//053xxx, 9053xxx, 090xxx, 0090xxx ... ->  53xxx
shm.msisdn = {
	fix : function (a){
	  	return 10 < a.length ? a.slice(-10) : a;
	},
	convertStartWithZero : function(msisdn){
		if(msisdn == "") {
			return msisdn;
		}
		msisdn = replaceAll("(","",msisdn);
		msisdn = replaceAll(")","",msisdn);
		msisdn = replaceAll("+","",msisdn);
		msisdn = replaceAll(" ","",msisdn); 
		msisdn = $.trim(msisdn);
		if ( msisdn.substring(0,2) == ("90") ) {
			msisdn =  msisdn.substring(2);
		} else if (msisdn.substring(0,3) == ("090") ) {
			msisdn =  msisdn.substring(3);
		} else if ( msisdn.substring(0,4) == ("0090") ) {
			msisdn = msisdn.substring(4);
		} else if (msisdn.substring(0,1) == ("0") ) {
			msisdn = msisdn.substring(1);
		} 
		
		msisdn = "0" + msisdn;
		return msisdn;
	}
};

shm.getOmccToken = function(_url, _opts, _data) {        var opts = _opts || {},
    body = '<?xml version="1.0"?><ccRequest>',
    originalCallback = opts.callback,
    originalFail = opts.fail;

for ( var key in opts.postdata ) {
    body += "<" + key + ">" + opts.postdata[key] + "</" + key + ">";
}

opts.postdata = body + "</ccRequest>";
opts.headers = {
    "X-TURKCELL": "pingpong",
    "Content-Type": "application/xml"
};

opts.callback = function(_response) {
    var response = $.parseJSON(_response);

    if ( response.operationResultCode === "0" ) {
        if ( $.isFunction( originalCallback ) ) {
            originalCallback( response.token );
        }
    } else {
        if ( $.isFunction( originalFail ) ) {
            originalFail( response.operationResultDescription );
        }
    }
};

shm.getServiceResponse( _url, opts );
};

shm.getServiceResponse = function(_url, _opts) {
if ( typeof _url === "string" ) {
    var opts = _opts || {},

        ajaxSettings = {
            type : opts.type || "POST",
            url : _url,
            headers : opts.headers || { "X-Tcell-Ajax": "true" },
            cache: ( opts.cache === false ) ? false : true,
            data : opts.postdata || {}
        };

    if ( opts.dataType ) {
        ajaxSettings.dataType = opts.dataType;
    }

    if ( opts.jsonpCallback ) {
        ajaxSettings.jsonpCallback = opts.jsonpCallback;
    }

    $.ajax( ajaxSettings ).done(function(response) {
        if ( $.isFunction ( opts.callback ) ) {
            opts.callback( response );
        }
    }).fail(function(jqXhr, textStaus, errorThrown) {
        // no error message on user abort
        if (jqXhr.status === 0 || jqXhr.readyState === 0) {
            return;
        }

        if ( $.isFunction ( opts.fail ) ) { // call fail function of caller, if exists
            opts.fail( jqXhr, textStaus, errorThrown );
        } else { // perform the default fail action
            if ( opts.popErrorMessages !== false ) {
                shm.showErrorModal();
            }

            throw "ajax call to " + _url + " has failed! Error message: " + errorThrown;
        }
    });

} else {
    throw "getJSON() : this method needs url argument";
}

};

shm.overflowTables = function(){
	$(".turkcell-rteTable-default").parent().addClass("overflow-table");
	$(".cms-content table").parent().addClass("overflow-table");
	$(".cms_contents table").parent().addClass("overflow-table");
};

shm.initNativeSelect = function(){
	$(document).find('.native-select[data-toggle=native-select] .native-select__text:empty').each(function(){
	    var html = $(this).closest('.native-select').find('.native-select__item option').not(function(){ return !this.selected; }).html();
	    $(this).text('.native-select__text').text(html);
	  });

	  $('.native-select--no-js').removeClass('native-select--no-js');
};

shm.resetNativeSelect = function($item){
	try {
		var $itemLabel = $item.parent().prev().text();
		$item.prev(".native-select__label").find(".native-select__text").text($itemLabel);
		$item.find("option").removeAttr("selected");
		$item.find("option:first").attr("selected","selected");
	} catch (e) {
		throw new Error("$item parameter must be select object - shm.resetNativeSelect");
	}
};

shm.isNativeSelectEmpty = function($item){
	var selectedVal = $.trim($item.find("option:selected").text() == undefined ? "" : $item.find("option:selected").text());
	var labelVal = $.trim($item.prev().find(".native-select__text").text());

	if(selectedVal != labelVal){
		return true;
	}else{
		return false;
	}
}

shm.getUserBasket = function(path){
	var $basketLink = $(".a-icon--basket") 
		 getBasketUrl = "/"+path+"/getBasket"; 
	if($basketLink.length >0){
		var opts = {};
		opts.callback = function (data){
			if(data.basketSize > 0 ){
				$basketLink.attr("data-basket-count",data.basketSize);
				$basketLink.removeClass("js-hidden");
				$basketLink.closest(".header").removeClass("quickwin_basket_area");
			}
		};
		opts.fail = function (){
		};
		
		shm.getServiceResponse( getBasketUrl, opts );
	}
}

$(document).on("ready", function () {
	
	shm.overflowTables();
	shm.getUserBasket("sepetim");
	if( typeof jQuery.aop !== "undefined"){ 
		
	    jQuery.aop.after({target: jQuery, method: 'show'},
	        function (result) {
	            if (result.selector.indexOf("mainPage") != -1) {
	                $("#mainWrapper").show();
	            }
	        }
	    );
    
	}

});

String.prototype.toLowerCaseTR = function() {
	var str = [];
	for ( var i = 0; i < this.length; i++) {
		var ch = this.charCodeAt(i);
		var c = this.charAt(i);
		if (ch == 304)                      str.push('i')
		else if (ch == 73)                 	str.push('ı')
		else if (ch == 286)                 str.push('ğ')
		else if (ch == 220)                 str.push('ü')
		else if (ch == 350)                 str.push('ş')
		else if (ch == 214)                 str.push('ö')
		else if (ch == 199)                 str.push('ç')
		else if (ch >= 65 && ch <= 90) str.push(c.toLowerCase())
		else                                str.push(c);
	}
	return str.join('');
}








