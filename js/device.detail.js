(function($) {
	"use strict";

	var deviceDetail = {};

	deviceDetail = {

		$addtoBasketButton : $('.add-to-basket'),
		$addtoBasketForNonLogin : $('.add-to-basket-non-login'),
		$rotateToCorporateForm : $('.rotate-to-corporate-form'),
		$addToBasketButtonAvailable : $('.device-available'),
		$addtoBasketNonLoginButton : $('#none-login-sale-button'),
		$addtoBasketNonLoginButtonWrap : $('.o-p-header__dropdown__login__continue-anon'),
		$notifyMeButton : $('.notify-me-button'),
		$loginButton : $('.js-login'),
		$stockButton : $('.js-pasaj-stock-button'),
		addToBasketCashUrl : '/pasaj/sepetim/ekle',
		addToBasketCashUrlNonLogin : '/pasaj/siparisler/ekle',
		deviceId : $('#deviceId').val(),
		$productColorSelect : $(".m-select-color"),
		$memorySelect : $(".m-select-memory"),
		$cashPriceArea : $(".price-radio-cash"),
		$contractedPriceArea : $(".price-radio-contracted"),
		$cashContractedPriceArea : $(".price-radio-cashContracted"),
		$creditSalesPriceArea : $(".price-radio-creditSales"),
		$contractedMonthOption : $('.month-options'),
		contractedPricingPageUrl : "/pasaj/" + $('input[name="deviceUrlPostfix"]').val() + "/ucretlendirme",
		$deviceDetailForm : $('#device-detail-form'),
		basketHasContracted : $('#basket-has-contracted').val(),
		basketHasCashContracted : $('#basket-has-cash-contracted').val(),
		basketHasShoppingCredit : $('#basket-has-shopping-credit').val(),
		html: $("html"),
		limitTypeMainSwitch : $('input[name="limitTypeMainSwitch"]'),

		init : function() {
			var self = this;
			$(function() {
				self.eventListeners.init(self);
			});
		},
		addToBasket : function(nonLogin,event) {

			if(this.deviceId==undefined){
				this.deviceId = event.target.getAttribute('data-device-id');
			}

			var $selectedRadio = $(".product-basket-type:checked");
			var type = $selectedRadio.data('type');

			if(type==undefined){
				type = event.target.getAttribute('data-type');
			}

			var selectedColorOption = $('.m-product-color select option:selected');
			var selectedPsi = $selectedRadio.data("psiId");

			if(selectedPsi==undefined){
				selectedPsi = event.target.getAttribute('data-psi-id');
			}

			var color =  selectedColorOption.data('color') != undefined ? selectedColorOption.data('color') : null;
			var postUrl = nonLogin ? this.addToBasketCashUrlNonLogin : this.addToBasketCashUrl;
			var postData = 'id=' + this.deviceId + '&psiId=' + selectedPsi + '&amount=1'+ '&colorHexCode='+color;
			var self =this;

			if(nonLogin){
				postData = 'isNoneLoginSale=true&'+postData;
			}

			if (type) {
				if (type === 'cash') {

					if($('.m-insurance__content input:checked')){
						var selectedInsurance = $('.m-insurance__content input:checked').prop("checked");
						if(selectedInsurance) {
							postData = postData + "&insurancePsiId=" + $('.m-insurance__content input:checked').val()
						}
					}
					
					SHOP.getJSONObject(postUrl, {
						postdata : postData,
						callback : function(resultObject) {
							if (resultObject && resultObject.success) {
								window.location = nonLogin  ? '/pasaj/siparisler' : '/pasaj/sepetim';
							} else {
								self.$addtoBasketButton.removeAttr('disabled');
								if (resultObject && resultObject.warningDigital) {
									$.fancybox.open({
										src: "#errorMsgDigitalCode",
										buttons: [],
										smallBtn: true
									});
								} else if (resultObject && resultObject.warningDonation) {
									$.fancybox.open({
										src : "#errorMsgDonation",
										buttons : [],
										smallBtn : true
									});
								} else if (resultObject && resultObject.warningDigitalNonLogin) {
									$.fancybox.open({
										src : "#errorMsgDigitalCodeNonLogin",
										buttons : [],
										smallBtn : true
									});
								} else if (resultObject && resultObject.warningDigitalAndDistributor) {
									$.fancybox.open({
										src : "#errorMsgDigitalAndDistributor",
										buttons : [],
										smallBtn : true
									});
								} else {
									$.fancybox.open({
										src: "#errorMsg",
										buttons: [],
										smallBtn: true
									});
								}
							}
						}
					});
				} else if (type === 'contracted' || type === 'cashContracted' || type === 'creditSales') {
					$('.modal-delete-message').hide();
					var showConfirmation = false;
					if (type === 'contracted' && this.basketHasContracted == 'true') {
						$('.modal-delete-message.contracted').show();
						showConfirmation = true;
					} else if(type === 'cashContracted' && this.basketHasCashContracted == 'true') {
						$('.modal-delete-message.cash-contracted').show();
						showConfirmation = true;
					}  else if (type === 'creditSales' && this.basketHasShoppingCredit == 'true'){
						$('.modal-delete-message.shopping-credit').show();
						showConfirmation = true;
					}
					if (showConfirmation) {
						$.fancybox.open({
							src : "#modal-delete",
							buttons : [],
							smallBtn : true,
							afterClose : function(instance, current, e) {
								var val = $(e.target).data("fancyboxClose");
								if (val == 'ok') {
									self.addContracted(selectedColorOption, selectedPsi);
								}
							}
						});
					} else {
						this.addContracted(selectedColorOption, selectedPsi);
						return;
					}
				}
			}
		},
		addContracted : function (selectedColorOption,selectedPsi){
			var self = this;
			var $type = $(".product-basket-type:checked").data('type');
			self.$addtoBasketButton.attr('disabled','disabled');
			selectedPsi = self.$productColorSelect.find(":selected").data("turkcellPsi");
			var url = this.contractedPricingPageUrl, selecedMonthOption = $('.month-options.active'), form = this.$deviceDetailForm;

			form.attr('action', url).attr('method', 'post');

			if ($type == 'contracted') {
				form.find('input[name="obligationPeriod"]').val(selecedMonthOption.data('period'));
				form.find('input[name="contractedPrice"]').val(selecedMonthOption.data('price'));
				if (self.limitTypeMainSwitch.val() === 'true') {
					form.find('input[name="initialLimitType"]').val(selecedMonthOption.data('limitType'));
				}
				form.find('input[name="contractBuyType"]').val('CONTRACTED');
				form.find('input[name="deviceOfferId"]').val(selecedMonthOption.data('deviceOfferId'));
				form.find('input[name="deviceCampaignId"]').val(selecedMonthOption.data('deviceCampaignId'));
				form.find('input[name="devicePmId"]').val(selecedMonthOption.data('devicePmId'));
			} else if ($type == 'cashContracted') {
				form.find('input[name="contractedPrice"]').val(self.$cashContractedPriceArea.find(".a-price-val").html());
				form.find('input[name="contractBuyType"]').val('CASH_CONTRACTED');
			} else if($type == 'creditSales') {
				form.find('input[name="obligationPeriod"]').val(selecedMonthOption.data('period'));
				form.find('input[name="contractedPrice"]').val(selecedMonthOption.data('price'));
				if (self.limitTypeMainSwitch.val() === 'true') {
					form.find('input[name="initialLimitType"]').val(selecedMonthOption.data('limitType'));
				}
				form.find('input[name="contractBuyType"]').val('CREDIT_SALES');
			}
			form.find('input[name="colorName"]').val(selectedColorOption.data('colorName'));
			form.find('input[name="psiId"]').val(selectedPsi);
			form.find('input[name="optionId"]').val(selectedColorOption.data('optionId'));
			form.find('input[name="colorHexCode"]').val(selectedColorOption.data('color'));

			form.submit();


		},
		insertParam: function (key, value) {
			key = encodeURIComponent(key);
			value = encodeURIComponent(value);
			var kvp = document.location.search.substr(1).split('&');
			let i = 0;
			for (; i < kvp.length; i++) {
				if (kvp[i].startsWith(key + '=')) {
					let pair = kvp[i].split('=');
					pair[1] = value;
					kvp[i] = pair.join('=');
					break;
				}
			}
			if (i >= kvp.length) {
				kvp[kvp.length] = [key, value].join('=');
			}
			let params = kvp.join('&');
			history.replaceState(null, '',"?" +params+document.location.hash);
		},
		toggleButton : function(showFirst, $var1, $var2) {
			var buttonDiv = document.querySelector(".product-detail__button");
			buttonDiv.style.display = "block";
			if (showFirst == true) {
				$var1.show();
				$var2.hide();
				if(buttonDiv.style.display === "none"){
					buttonDiv.style.display = "block";
				}
			} else {
				if(buttonDiv.style.display === "block"){
					buttonDiv.style.display = "none";
				}
				$var1.hide();
				$var2.show();
			}

		},
		controlOutOfStockBadge: function (hasStock, $priceArea) {
			var badge = $priceArea.find(".a-price-radio-b__badge");
			badge.html(badge.data('badgeContractedOutOfStock'))
			if (!$priceArea.hasClass("a-price-radio-b--advantage")) {
				$priceArea.addClass('a-price-radio-b--advantage');
			}
			if (hasStock) {
				badge.hide();
				var badgeTitle = $priceArea.data('badgeTitle');
				if (badgeTitle) {
					badge.html(badgeTitle);	
					badge.show();
				}
				var discountArea = $priceArea.find('.a-price--discount');
				if (discountArea.length > 0) {
					$priceArea.addClass('a-price-radio-b--special');
					badge.html(badge.data('badge-contracted-special'));	
					badge.show();
				}
				$priceArea.find("input.product-basket-type:radio").unbind("click").click(function () {
					return true;
				});
				$priceArea.find(".a-price-radio-b__badge").css("background-color", "#00bafc");
				$priceArea.find(".a-price-val").css("color", "#2855ac");
				$priceArea.find(".a-price__currency").css("color", "#2855ac");
				$priceArea.find(".a-price-radio-b__note").css("color", "#8e9fad");
			} else {	
				badge.show();
				$priceArea.find("input.product-basket-type:radio").prop("checked", false);
				$priceArea.find("input.product-basket-type:radio").unbind("click").click(function () {
					return false;
				});
				$priceArea.find(".a-price-radio-b__badge").css("background-color", "#bfc4c8");
				$priceArea.find(".a-price-radio-b__title").css("color", "#d2d9de");
				$priceArea.find(".a-price-val").css("color", "#bfc4c8");
				$priceArea.find(".a-price__currency").css("color", "#bfc4c8");
				$priceArea.find(".a-price-radio-b__note").css("color", "#bfc4c8");
				if (!$priceArea.hasClass("a-price-radio-b--advantage")) {
					$priceArea.addClass("a-price-radio-b--advantage");
				}
			}
		},
		sendUtagDataForAddToCart : function() {
			try {
				var self = this,
					$deviceDetailUtagData = $('#shopDeviceDetailUtagData');

				if($deviceDetailUtagData.length) {
					var $type = $(".product-basket-type:checked").data('type'),
						$selectedColorOption = $('.m-product-color select option:selected');

					var utag_data = utag_data || {};
					utag_data.pageName = "sepeteat";
					utag_data.page_type = "sepeteat";
					utag_data.product_price  = self.$cashPriceArea.find(".a-price-val").html();
					utag_data.product_name = [$deviceDetailUtagData.data('productTitle')];
					utag_data.product_category = [$deviceDetailUtagData.data('productCategory')];
					utag_data.product_brand = [$deviceDetailUtagData.data('brand')];
					utag_data.product_id = [$deviceDetailUtagData.data('productId')];
					utag_data.product_quantity=[1];

					if(utag_data.product_category != undefined && utag_data.product_category != "" && utag_data.product_category == "Aksesuarlar"){
						utag_data.product_sub_category = [$deviceDetailUtagData.data('productSubCategory')];
					}

					if($type === 'cash'){
						utag_data.payment_method = "pesin";
					} else if ($type == 'contracted') {
						utag_data.payment_method = "kontratli";
					} else if ($type == 'cashContracted') {
						utag_data.payment_method = "pesine kontratli";
					} else if($type == 'creditSales') {
						utag_data.payment_method = "alisveris kredili";
					} else {
						utag_data.payment_method = "NA";
					}

					var deviceImages = $('.m-slider--device-slider .swiper-slide');
					if (deviceImages.length > 0) {
						var deviceImage = deviceImages[0];
						utag_data.product_image_url=[$(deviceImage).data('background')]
					}

					var deviceColorName = $selectedColorOption.html();
					if (deviceColorName) {
						utag_data.product_color=[deviceColorName];
					}

					window.RecommendationPopin.options.TEALIUM.pushTealiumState(utag_data);

					console.log("Tealium - sepeteat "+utag_data.product_name+", "+utag_data.product_category+", "+utag_data.product_brand+", "+utag_data.product_id+", "+utag_data.payment_method);

					if($deviceDetailUtagData.data('userLogged') === false) {
						window.RecommendationPopin.options.TEALIUM.pushTealiumState('Login Popup-Kombo',false);
					}

				}
			} catch (e) {
				console.log(e);
			}
		},
		eventListeners : {
			controller : {},

			init : function(_controller) {
				var self = this;
				self.controller = _controller;
				if (self.controller.$productColorSelect.length === 0) {
					let psiId = self.controller.$addtoBasketButton.data("psi-id") !== undefined ? self.controller.$addtoBasketButton.data("psi-id") : self.controller.$addtoBasketForNonLogin.data("psi-id");
					self.controller.$cashPriceArea.find(".product-basket-type").data("psiId",psiId);
				}
				if (self.controller.$contractedPriceArea.length > 0) {
					self.controller.$contractedPriceArea.find('.turkcell-price-unit').show();
				}
				self.addToBasketHandler();
				self.priceRadioInputChangeHandler();
				self.colorChangedHandler();
				self.memoryChangedHandler();
				self.deviceOfferPeriodChangedHandler();
				self.urlHandler();
				self.generalRedirectHandler();
			},

			urlHandler : function() {
				var controller = this.controller;


				// get specific query param from url with special key
				function getParameterByName(name, url) {
					try {
						if (!url) url = window.location.href;
						name = name.replace(/[\[\]]/g, "\\$&");
						var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
							results = regex.exec(url);
						if (!results) return null;
						if (!results[2]) return '';
						return decodeURIComponent(results[2].replace(/\+/g, " "));
					} catch (e) {
						googleAnalyticLog(e, true);
					}
				}
				var psiId = getParameterByName('psiId');

				if (window.location.href.indexOf("modal-stock") != -1 && psiId != null) {
					controller.$productColorSelect.val(controller.$productColorSelect.find("[data-turkcell-psi='"+psiId+"']").val()).trigger('change');
				} else if (psiId != null) {
					controller.$productColorSelect.val(controller.$productColorSelect.find("[data-psi-id='"+psiId+"']").val()).trigger('change');
				}

				var hashFromUrl = window.location.hash;
				if (hashFromUrl && hashFromUrl == "#giris" && shConfig.loggedIn) {
					window.location.href = location.href.replace("#giris", "");
				}
				if (hashFromUrl && (hashFromUrl.indexOf("notAvailableContracted") >= 0 || hashFromUrl.indexOf("notAvailableCashContracted") >= 0)
					&& SHOP.isUserLoggedIn()) {

					var contracted = hashFromUrl.indexOf("notAvailableContracted") >= 0;
					var modal$ = $('#modal-not-available-offer');
					modal$.find('.modal-message').hide();
					modal$.find(contracted ? '.contracted' : '.cash-contracted').show();

					$.fancybox.open({
						src : "#modal-not-available-offer",
						buttons : [],
						smallBtn : true,
						baseClass: "fancybox--warning m-modal--alert",
						afterClose : function(instance, current, e) {
							var val = $(e.target).data("fancyboxClose");
							if (val == 'ok') {
								var uri = window.location.toString();
								if (uri.indexOf("#") > 0) {
									var clean_uri = uri.substring(0, uri.indexOf("#"));
									window.history.replaceState({}, document.title, clean_uri);
								}
							}
						}
					});
				}
				//openWebViewUrl
				$(document).on('click', '.openWebViewUrl', function(e) {
					e.preventDefault();
					$.cookie("nativeapp", false, { path: '/' });
					let deviceUrl = window.location.href.replace(window.location.search, "") + '?nativeapp=false';
					if(shm.is.deviceIOS()) {
						window.webkit.messageHandlers.navigateToExternalBrowser.postMessage(`"${deviceUrl}"`);
					}
				});
			},

			updateSellerAnalyticsInfo : function(psiId) {
				var googleAnalyticsSellerInfoEl$ = $('#google-analytics-device-selected-seller-informations');
				if (googleAnalyticsSellerInfoEl$) {
					googleAnalyticsSellerInfoEl$.data('psi-id', psiId);
				}
			},

			addRedirectUrlAfterLogin : function (){

				const turkcellPsi = $('.m-product-color select option:selected').data('turkcell-psi');
				var param = '';
				if(turkcellPsi && location.href.includes("?")) {
					$("input[name='shop_redirect_uri']").val(location.href + '&psiId=' + $('.m-product-color select option:selected').data('turkcell-psi') + '#modal-stock');
					param = encodeURIComponent(location.href + '&psiId=' + $('.m-product-color select option:selected').data('turkcell-psi') + '#modal-stock');
				}
				else if(turkcellPsi && !location.href.includes("?")){
					$("input[name='shop_redirect_uri']").val(location.href + '?psiId=' + $('.m-product-color select option:selected').data('turkcell-psi') + '#modal-stock');
					param = encodeURIComponent(location.href + '?psiId=' + $('.m-product-color select option:selected').data('turkcell-psi') + '#modal-stock');
				}else{
					$("input[name='shop_redirect_uri']").val(location.href + '#modal-stock');
					param = encodeURIComponent(location.href +'#modal-stock');
				}

				$("#redirectUrlAfterLogin").val(param);

			},

			generalRedirectHandler : function() {
				$(document).on('click' ,'.general-redirect', function(e) {
					const dataRedirectValue = $(this).data('redirect');
					$("#redirectUrlAfterLogin").val(dataRedirectValue);
				});		
			},

			addToBasketHandler : function() {
				var self = this,
					controller = self.controller;

				//controller.$addtoBasketButton.on("click", function(e) {
				$(document).on('click', '.add-to-basket', function(e) {
					e.preventDefault();
					// controller.$loginButton.click();
					if(controller.eventListeners.deviceOnBasket()) {
						window.location = '/pasaj/sepetim';
					} else {
						controller.sendUtagDataForAddToCart();
						var $selectedRadio = $(".product-basket-type:checked");
						if ($selectedRadio) {
							self.updateSellerAnalyticsInfo($selectedRadio.data('psiId'));
						}
						controller.addToBasket(false,e);
					}
				});

				//controller.$addtoBasketForNonLogin.on("click", function(e) {
				$(document).on('click', '.add-to-basket-non-login', function(e) {
					const buttonType  = $(this).data('type');
					const href  = $(this).data('url');
					const digital = $(this).data('digital');

					if(controller.eventListeners.deviceOnBasket()) {
						window.location = '/pasaj/siparisler';
					} else {
						var $selectedRadio = $(".product-basket-type:checked");
						if ($selectedRadio) {
							var type = $selectedRadio.data('type');
							controller.$addtoBasketNonLoginButtonWrap.css('display', 'none');
							if (type === 'cash' && !digital) {
								controller.$addtoBasketNonLoginButtonWrap.css('display', 'block');
							}

							var inApp=$("html").hasClass("in-app");
							if(inApp){
								$(".m-header-dropdown").find(".js-o-header-mobile-login").addClass("opened");
								$(".m-header-dropdown").addClass("m-header-dropdown--opened");
							}
							self.updateSellerAnalyticsInfo($selectedRadio.data('psiId'));
						}
						controller.sendUtagDataForAddToCart();
						shConfig.loginSuccessCallback = function() {
							controller.addToBasket();
						};
					}
				});

				$(document).on('click', '.rotate-to-corporate-form', function(e) {
						const psiId  = $(this).data('psiId');
						const buttonType  = $(this).data('type');
						const href  = $(this).data('url');

						controller.$addtoBasketNonLoginButtonWrap.data("psi-id",psiId);
						controller.$addtoBasketNonLoginButtonWrap.data("type",buttonType);

						if(controller.eventListeners.deviceOnBasket(psiId)) {
							window.location = '/pasaj/siparisler';
						} else {
							var $selectedRadio = $(".product-basket-type:checked");
							if ($selectedRadio) {
								controller.$addtoBasketNonLoginButtonWrap.css('display', 'none');

								self.updateSellerAnalyticsInfo(psiId);
							}
							$("#redirectUrlAfterLogin").val(href);
						}
				});

				controller.$addtoBasketNonLoginButton.on("click", function(e) {
					e.preventDefault();
					controller.addToBasket(true);
				});

				controller.$stockButton.on("click", function(e) {
					controller.$addtoBasketNonLoginButtonWrap.css('display', 'none');

					self.addRedirectUrlAfterLogin();

					if (!$(".notify-me-button").attr('data-notify-me')) {
						$(".notify-me-button").attr('data-notify-me', true);
					}
				});

				$(".add-to-basket-non-login , .notify-me-button").on("click", function(e) {
					if (true === $(this).data('notifyMe')) {
						self.addRedirectUrlAfterLogin();

					} else {
						var $selectedRadio = $(".product-basket-type:checked");

						var shop_redirect_uri = $("input[name='shop_redirect_uri']");
						var redirectUrlAfterLogin = $("#redirectUrlAfterLogin");
						var type = $selectedRadio.data('type');
						if(type === 'cash') {
							var selectedPsiId = $selectedRadio.data('psiId');
							var postData = 'id=' + controller.deviceId + '&psiId=' + selectedPsiId + '&amount=1';
							shop_redirect_uri.val("/pasaj/sepetim/add-after-login?"+postData);

							var postData2 = 'id=' + controller.deviceId + '%26psiId=' + selectedPsiId + '%26amount=1';
							redirectUrlAfterLogin.val("/pasaj/sepetim/add-after-login%3F"+postData2);
						} else {
							var baseUrl = controller.contractedPricingPageUrl;
							var selectedMonthOption = $(".month-options.active");
							var selectedColorOption = $(".m-product-color select option:selected");
							var selectedPsiId = selectedColorOption.data('turkcell-psi');

							var parameters = {"colorName" : selectedColorOption.data("colorName"),
								"psiId": selectedPsiId,
								"optionId" : selectedColorOption.data("optionId"),
								"colorHexCode" : selectedColorOption.data("color").replace("#", "%23")};

							if (type === "contracted") {
								parameters.obligationPeriod = selectedMonthOption.data("period");
								parameters.contractedPrice = selectedMonthOption.data("price");
								parameters.contractBuyType = "CONTRACTED";
								if ($('input[name="limitTypeMainSwitch"]').val() === 'true') {
									parameters.initialLimitType = selectedMonthOption.data('limitType');
								}
							} else if (type === "cashContracted") {
								parameters.contractedPrice = self.$cashContractedPriceArea.find(".a-price-val").html();
								parameters.contractBuyType = "CASH_CONTRACTED";
							} else if (type === "creditSales") {
								parameters.obligationPeriod = selectedMonthOption.data("period");
								parameters.contractedPrice = selectedMonthOption.data("price");
								parameters.contractBuyType = "CREDIT_SALES";
								if ($('input[name="limitTypeMainSwitch"]').val() === 'true') {
									parameters.initialLimitType = selectedMonthOption.data('limitType');
								}
							}

							var params1 = Object.keys(parameters).map(function(k) {
								return encodeURIComponent(k) + '=' + encodeURIComponent(parameters[k])
							}).join('&');

							var params2 = Object.keys(parameters).map(function(k) {
								return encodeURIComponent(k) + '=' + encodeURIComponent(parameters[k])
							}).join('%26');

							shop_redirect_uri.val(baseUrl + "?" + params1);
							redirectUrlAfterLogin.val(baseUrl + "%3F" + params2);
						}
					}
				});
			},

			deviceOnBasket : function() {
				var $selectedRadio = $(".product-basket-type:checked");
				if ($selectedRadio.length > 0 && $selectedRadio.data('type') === 'cash') {
					var $selectedColorOption = $('.m-product-color select option:selected');
					if($selectedColorOption.length > 0 && $selectedColorOption.data('atBasket')) {
						return true;
					}
				}
				return false;
			},

			colorChangedHandler : function() {
				var controller = this.controller;

				var cashPriceArea = controller.$cashPriceArea;
				var contractedPriceArea = controller.$contractedPriceArea;
				var oldPriceArea = cashPriceArea.find('.a-price__old');
				var discountTextArea = cashPriceArea.find('.discount-text');
				var discountArea = cashPriceArea.find('.a-price--discount');
				var radioInput = cashPriceArea.find(".product-basket-type");
				var onBasketText = controller.$addToBasketButtonAvailable.data('onbasketText');
				var addBasketText = controller.$addToBasketButtonAvailable.data('addText');
				var turkcellPriceArea =  cashPriceArea.find('.turkcell-price');
				var turkcellDiscountRatioArea = cashPriceArea.find('.turkcell-ratio');


				controller.$productColorSelect.on("change", function(e) {
					var $selected = $(this).find("option:selected");
					discountArea.hide();
					oldPriceArea.html("");
					discountTextArea.html("");
					turkcellPriceArea.hide();
					turkcellDiscountRatioArea.hide();

					var stockAvailable = $selected.data("stockAvailable");
					var price = $selected.data('price');
					var oldPrice = $selected.data("oldPrice");
					var turkcellSketchedPrice = $selected.data("turkcell-sketched-price");
					var turkcellAmount = $selected.data('turkcellAmount');
					var turkcellPrice = $selected.data("turkcell-price");
					var turkcellPriceDiscountRatio = $selected.data("turkcell-price-discount-ratio");
					var psiId = $selected.data('psiId')
					var turkcellPsiIdOfSelectedColor = $selected.data('turkcell-psi')
					var discountText = $selected.data("discountText");
					var stockMessage = $selected.data('stock-message');
					var deviceAtBasket = $selected.data('atBasket');
					var sellerLink = '<a href="/pasaj/magaza/' + $selected.data('encodedSellerName') + '"' + ' style="color:#2855ac;font-size:12px;font-weight: 700;">' + $selected.data('sellerName') + '</a>'
					var sellerName = $selected.data('sellerName');
					var countdown = $selected.data("seller-countdown");
					var selectedColor = $selected.val();
					var cargoSla = $selected.data('cargoSla');

					controller.$addToBasketButtonAvailable.data("psi-id",psiId);
					controller.$addToBasketButtonAvailable.attr("data-psi-id",psiId);

					if (oldPrice) {
						discountArea.show();
						oldPriceArea.html(oldPrice);
						discountTextArea.html(discountText);
					}

					if (turkcellSketchedPrice) {
						turkcellPriceArea.show();
						turkcellDiscountRatioArea.show();
						turkcellPriceArea.html(turkcellSketchedPrice);
						turkcellDiscountRatioArea.html(turkcellPriceDiscountRatio);
					}

					$('#salesInfoId').val(turkcellPsiIdOfSelectedColor); // NotifyMe Hidden Input Value

					radioInput.data("psiId",$selected.data('psiId'));

					let hasTurkcellStock = turkcellAmount && turkcellAmount > 0;

					if ($(".product-basket-type:checked").data("type") === "contracted" && hasTurkcellStock) {
						contractedPriceArea.find("input.product-basket-type:radio").prop("checked", true)
					} else if (cashPriceArea.length > 0 && price != null) { // update cash price
						cashPriceArea.find(".a-price-val").html(price);
						var storePageEnabled = $('#storePageEnabled').val();
						var turkcellStorePageEnabled = $('#turkcellStorePageEnabled').val();
						var isTurkcellStore = $selected.data('sellerId') === 1;
						if(storePageEnabled === "true" && (!isTurkcellStore || (isTurkcellStore && turkcellStorePageEnabled === "true" ) ) ) {
							cashPriceArea.find(".seller-name").html(sellerLink);
							cashPriceArea.find(".a-price-radio-b__title").html(sellerLink);
						} else {
							cashPriceArea.find(".seller-name").html(sellerName);
							cashPriceArea.find(".a-price-radio-b__title").html(sellerName);
						}
						if (cargoSla != null) {
							cashPriceArea.find(".seller-cargo-sla").html(cargoSla);
						}
						cashPriceArea.find("label").trigger("click");
					}

					if (countdown) {
						$('#top-counter-discount > .a-countdown').countdown(countdown)
						$('#top-counter-discount').show();
					} else {
						$('#top-counter-discount').hide();
					}

					if (countdown && stockMessage) {
						$('#last-stock-message > strong').text(stockMessage);
						$('#last-stock-message').show();
					} else {
						$('#last-stock-message').hide();
					}


					controller.controlOutOfStockBadge(hasTurkcellStock, controller.$contractedPriceArea);

					let contractSelected = $(".product-basket-type:checked").data("type") === "contracted" && hasTurkcellStock;
					if (contractSelected) {
						$('#orderType').val("contracted");
					} else {
						$('#orderType').val("cash");
						if (!hasTurkcellStock) {
							cashPriceArea.find("input.product-basket-type:radio").prop("checked", true);
						}
					}

					let showAddtoBasketButton = contractSelected ? hasTurkcellStock : stockAvailable;
					controller.toggleButton(showAddtoBasketButton, controller.$addToBasketButtonAvailable, controller.$notifyMeButton);

					let $comingSoonText = $(".m-product-coming-soon");
					let $advantagePriceRadio = $('.a-price-radio-b--advantage')
					let $insurance = $('.m-insurance');
					let $insuranceTitle = $('.m-basket-card__gifts-title');
					$comingSoonText.hide();
					$advantagePriceRadio.hide();
					if($insurance){
						$insurance.hide();
						$insuranceTitle.hide();
					}
					if (stockAvailable) {
						if($insurance){
							$insurance.show();
							$insuranceTitle.show();
						}
						var $selectedRadio = $(".product-basket-type:checked");
						var cashSelected = $selectedRadio.data("type");
						$advantagePriceRadio.show();

						if (cashSelected=='cash' && deviceAtBasket == true) {
							controller.$addToBasketButtonAvailable.html(onBasketText);
						} else {
							controller.$addToBasketButtonAvailable.removeAttr('disabled');
							controller.$addToBasketButtonAvailable.html(addBasketText);
						}
					} else {
						$comingSoonText.show();
					}


					let disableClicks = $(this).attr('disable-clicks');
					$(this).attr('disable-clicks',false);
					if(disableClicks && disableClicks ==='true') {
						return;
					}

					if (controller.$cashContractedPriceArea && controller.$cashContractedPriceArea.length > 0 && turkcellAmount && turkcellAmount >0) {
						var contractedCashPrice = controller.$cashContractedPriceArea != null ? controller.$cashContractedPriceArea.find(".a-price-val").html() : '';
						controller.$cashContractedPriceArea.show();
						if (turkcellPrice) {
							var ccp = parseFloat(contractedCashPrice.replace(".", "").replace(",", "."));
							var tp = parseFloat(turkcellPrice);
							if (tp < ccp) {
								controller.$cashContractedPriceArea.hide();
							}
						}
					} else {
						controller.$cashContractedPriceArea.hide();
					}

					if(controller.$contractedPriceArea && controller.$contractedPriceArea.length > 0){
						controller.$contractedPriceArea.show();
						if((!turkcellAmount || turkcellAmount <= 0) && $(".m-card-offer--pasaj").length > 0){
							controller.$cashContractedPriceArea.hide();
							controller.$contractedPriceArea.hide();
						}

					}

					if(controller.$creditSalesPriceArea && controller.$creditSalesPriceArea.length > 0){
						controller.$creditSalesPriceArea.show();
						if(!turkcellAmount || turkcellAmount <= 0){
							controller.$creditSalesPriceArea.hide();
						}
					}
				});

				controller.$productColorSelect.change();

			},
			memoryChangedHandler : function() {
				var controller = this.controller;

				controller.$memorySelect.on("change", function(e) {
					var $selected = $(this).find("option:selected");
					var deviceHref = $selected.val();

					location.href = deviceHref;
				});

				var selected = controller.$memorySelect.find("[selected='selected']");
				$(".m-product-memory #select2--container").html(selected.text());
				// controller.$memorySelect.change();
			},

			deviceOfferPeriodChangedHandler : function() {
				var controller = this.controller;
				var contractedPriceArea = controller.$contractedPriceArea, contractedMonthOption = controller.$contractedMonthOption,
					creditSalesPriceArea = controller.$creditSalesPriceArea, limitTypeMainSwitch = controller.limitTypeMainSwitch;

				contractedMonthOption.on('click', function(e) {
					var $selectedRadio = $(".product-basket-type:checked");
					var type = $selectedRadio.data('type');
					var button = $(this);
					if (type === 'contracted') {
						contractedPriceArea.find('.a-price-val').html(button.data('price'));
						if (limitTypeMainSwitch.val() === 'true') {
							contractedPriceArea.find(".a-price-radio-b__title").html(button.data('priceRadioText'));
						}
						var currencyArea = contractedPriceArea.find('.a-price__currency').closest('sup');
						var discountArea = contractedPriceArea.find('.a-price--discount');
						if (button.data('oldPrice')) {
							discountArea.find('.a-price__old').html(button.data('oldPrice'));
							discountArea.find('.turkcell-ratio').html(button.data('discountRate'));
							discountArea.find('.turkcell-price-unit').show();
							discountArea.show();
						} else {
							discountArea.hide();
						}
					} else if (type === 'creditSales') {
						creditSalesPriceArea.find('.a-price-val').html(button.data('price'));
						if (limitTypeMainSwitch.val() === 'true') {
							creditSalesPriceArea.find(".a-price-radio-b__title").html(button.data('priceRadioText'));
						}
						var currencyArea = creditSalesPriceArea.find('.a-price__currency').closest('sup');
					}
					currencyArea.html(currencyArea.html().substring(0, currencyArea.html().indexOf('x') + 1) + $(this).data('period') + ' ' + $(this).data('month'));
				});
			},

			priceRadioInputChangeHandler : function() {
				var controller = this.controller, addToBasketButton = controller.$addtoBasketButton;

				var $selectedRadio = $(".product-basket-type:checked");
				addToBasketButton.html($selectedRadio.data('buyBtnTitle'));

				$(document).on('change', '.product-basket-type', function () {
					$selectedRadio = $(".product-basket-type:checked");
					let contractSelected = $selectedRadio.data("type") === "contracted";
					var $selectedColor = $(".m-select-color option:selected");
					let offerBoxSelected = $selectedRadio.parents().hasClass("product-detail-top-offer-box__list");
					let hasTurkcellStock = $selectedColor.data('turkcellAmount') && $selectedColor.data('turkcellAmount') > 0;
					var stockAvailable = $selectedColor.data("stockAvailable");

					if (contractSelected) {
						$('#orderType').val("contracted");
					} else {
						$('#orderType').val("cash");
					}

					if (hasTurkcellStock) {
						if (controller.$contractedPriceArea.find("input.product-basket-type:radio").prop("checked")) {
							controller.$contractedPriceArea.find(".a-price-radio-b__title").css("color", "#5f6b76");
						} else {
							controller.$contractedPriceArea.find(".a-price-radio-b__title").css("color", "#8e9fad");
						}
					}

					let showAddtoBasketButton;
					if (offerBoxSelected || $selectedColor.length === 0) {
						showAddtoBasketButton = true;
					} else {
						showAddtoBasketButton = contractSelected ? hasTurkcellStock : stockAvailable;
					}
					controller.toggleButton(showAddtoBasketButton, controller.$addToBasketButtonAvailable, controller.$notifyMeButton);
					addToBasketButton.html($(this).data('buyBtnTitle'));
					//controller.$productColorSelect.change();
				});

			}
		}

	}.init();

})(jQuery);
