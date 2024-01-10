$(document).ready(function(){
	
	var googleAnalyticsObject = {};
	
	// Cihaz listelerinin google'a gonderilmesi
	
	if($('#campaignDevices').length > 0){
		sendProductListToGoogleAnalytics('#campaignDevices');
	}
	
	if($('.product-list__cards').length > 0){
		sendProductListToGoogleAnalytics('.product-list__cards'); // device & accesorry & campaign
	}
	
	if($('#mostPopularProducts').length > 0){
		sendProductListToGoogleAnalytics('#mostPopularProducts');
	}
	
	if($('#genericProductList').length > 0){
		sendProductListToGoogleAnalytics('#genericProductList');
	}
	
	if($('#passageLastSeenProducts').length > 0){
		sendProductListToGoogleAnalytics('#passageLastSeenProducts');
	}
	
	if($('#passagePopularProductList').length > 0){
		sendProductListToGoogleAnalytics('#passagePopularProductList');
	}
	
	if($('#passageGenericProductList').length > 0){
		sendProductListToGoogleAnalytics('#passageGenericProductList');
	}
	
	function sendProductListToGoogleAnalytics(deviceListElementName){
		try {
			var deviceList = $(deviceListElementName + ' .google-analytics-device');
			if(deviceList != null && deviceList != undefined && deviceList.length > 0){
				$.each(partition(deviceList, 10), function(index, deviceList){
					preparingProductList(deviceList);
				});
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function partition(items, size) {
		try {
			var p = [];
			for (var i=Math.ceil(items.length/size); i-->0; ) {
				p[i]=items.slice(i*size, (i+1)*size);
			}
			return p;
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function preparingProductList(deviceList){
		try {
			googleAnalyticsObject = {};
			googleAnalyticsObject.event = 'productImpression';
			googleAnalyticsObject.eventCategory = 'ecommerce';
			googleAnalyticsObject.eventAction = 'Product Impression';
			googleAnalyticsObject.currencyCode = 'TRY';
			googleAnalyticsObject.ecommerce = {};
			googleAnalyticsObject.ecommerce.impressions = [];
			
			$.each(deviceList, function(index, deviceDiv){
				var $deviceInformationDiv = $(deviceDiv).find('#google-analytics-device-informations');
				var product = preparingCommonProductObject($deviceInformationDiv)
				googleAnalyticsObject.ecommerce.impressions.push(product);
			});
			googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
			dataLayerPushAsync(googleAnalyticsObject);
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function dataLayerPush(googleAnalyticsObject) {
		  return new Promise(resolve => {
		    setTimeout(() => {
		    	dataLayer.push(googleAnalyticsObject);
		    }, 2000);
		  });
		}

	async function dataLayerPushAsync(googleAnalyticsObject) {
		  const msg = await dataLayerPush(googleAnalyticsObject);
		}
	
	// Liste uzerinde cihaza tiklandiginda cihaz detayina gidilmeden google'a event atilmasi.
	$('.device-detail-btn').on('click', function(e){
		try {		
			var target = $(e.target);
			if (target != null && target!= undefined && target.hasClass('swiper-pagination-bullet') == false
				&& target.hasClass('heart') == false && target.hasClass('heart-fill') == false &&
				$(this).closest('.google-analytics-device') !=null && $(this).closest('.google-analytics-device')!= undefined &&  
				$(this).closest('.google-analytics-device').hasClass('m-p-pc--compare')==false) {
				e.preventDefault();
				var $deviceDetailBtn = $(this);
		
				var $deviceInformationDiv = $deviceDetailBtn.closest('.google-analytics-device').find('#google-analytics-device-informations');
			
				googleAnalyticsObject = {};
				googleAnalyticsObject.event = 'productClick';
				googleAnalyticsObject.eventCategory = 'ecommerce';
				googleAnalyticsObject.eventAction = 'Product Click';
				googleAnalyticsObject.ecommerce = {};
				googleAnalyticsObject.ecommerce.click = {};
				googleAnalyticsObject.ecommerce.click.actionField = {};
				googleAnalyticsObject.ecommerce.click.actionField.list = $deviceInformationDiv.data('sectionTitle');
				googleAnalyticsObject.ecommerce.click.products = [];
			
				var product = preparingCommonProductObject($deviceInformationDiv)
				googleAnalyticsObject.ecommerce.click.products.push(product);
			
				// put into cookie selected productId and deviceListName
				if(product.id != null && product.id != undefined){
					putDeviceListMapIntoCookie(product.id, $deviceInformationDiv.data('sectionTitle') + "#" + product.position);
				}
			
				googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
				dataLayer.push(googleAnalyticsObject);
				
				document.location = $deviceDetailBtn.attr('href');	
			} 
			
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	});
	
	// Cihaz detayina gidildiginde google'a event atilmasi.
	if($('#product-detail').length > 0){
		try {
			var $productDetailEl = $('#product-detail');
			if ($productDetailEl.data('pageType') === 'product-detail-page') {
				var placeParamaterFromUrl = getParameterByName('place');
				
				googleAnalyticsObject = {};
				googleAnalyticsObject.event = 'productDetail';
				googleAnalyticsObject.eventCategory = 'ecommerce';
				googleAnalyticsObject.eventAction = 'Product Detay';
				googleAnalyticsObject.ecommerce = {};
				googleAnalyticsObject.ecommerce.detail = {};
				googleAnalyticsObject.ecommerce.detail.actionField = {};
				googleAnalyticsObject.ecommerce.detail.products = [];
				
				var product = {};
				var $deviceInformationElement = $productDetailEl.find('#google-analytics-device-informations');
				product = preparingCommonProductObject($deviceInformationElement);
				
				// cookie'den cihazin hangi listeye ait oldugunun bulunmasi
				var deviceListName = getDeviceInfoByTypeFromCookie(product.id, 'listName');
				if(deviceListName != null && deviceListName != undefined){
					product.list = deviceListName;
					product.position = getDeviceInfoByTypeFromCookie(product.id, 'position');
					googleAnalyticsObject.ecommerce.detail.actionField.list = deviceListName;
				} else {
					googleAnalyticsObject.ecommerce.detail.actionField.list = placeParamaterFromUrl;
				}
				
				var productPrice = getProductPriceByType();
				if(productPrice != undefined) {
					product.price = productPrice;
				}
				
				googleAnalyticsObject.ecommerce.detail.products.push(product);
				googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
				dataLayer.push(googleAnalyticsObject);
				
				insiderProductDetailPage(product);
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function insiderProductDetailPage(product) {
		try {
			var insiderVal = $('#product-detail').data('productInsider');
			if (insiderVal != null && insiderVal != undefined) {

				var sellerJsonMap = getSellerInformationJsonMap();
				var sellerInformation = getSellerInformationByPsiId(insiderVal.psiId, sellerJsonMap);
				if (sellerInformation) {
					if (product.dimension25 === "Pesin") {
						insiderVal.promotionName = sellerInformation.analyticDiscountName; 
						insiderVal.promotionDiscount = sellerInformation.analyticDiscountRatio;
					}
					
					if (sellerJsonMap != null && sellerJsonMap != undefined && sellerInformation.colorId != undefined && sellerInformation.colorId != null) {
						var groupedDataByGivenColorId = sellerInfosGroupByColorId(sellerJsonMap, sellerInformation.colorId);
						if (groupedDataByGivenColorId != null && groupedDataByGivenColorId != undefined) {
							insiderVal.detailstock = groupedDataByGivenColorId.map(item => item.amount).reduce((prev, next) => prev + next);
						}
					}
				}
				
				insiderVal = JSON.stringify(insiderVal);
				googleAnalyticLog(insiderVal, false, "insider-product-detail");
				if (isPassageInsiderActive === true) {
					if (typeof Android !== "undefined") {
						Android.visitProductDetailPage(insiderVal);
					} else if(shm.is.deviceIOS()) {
						try {
							window.webkit.messageHandlers.visitProductDetailPage.postMessage(insiderVal);
						} catch(err) {
							googleAnalyticLog("The native context does not exist yet", true, "insider-product-detail");
						}
					}	
				}
			}
		} catch (e) {
			googleAnalyticLog(e, true, "insider-product-detail");
		}
	}
	
	function sellerInfosGroupByColorId(jsonMap, colorId) {
		try {
			if (jsonMap != null && jsonMap != undefined) {
				var groupedData = groupArrayOfObjects(Object.values(jsonMap), "colorId");
				if (groupedData != null && groupedData != undefined) {
					return groupedData[colorId];	
				}
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
		return null;
	}
	
	function groupArrayOfObjects(list, key) {
	  return list.reduce(function(rv, x) {
	    (rv[x[key]] = rv[x[key]] || []).push(x);
	    return rv;
	  }, {});
	}
	
	function getProductPriceByType () {
		var productBasketType = getProductBasketType(), price;
		try {
			if(productBasketType === 'cash') {
				var priceStr = $(".price-radio-cash").find(".a-price-val").html();
				if (priceStr.indexOf('.') > 0) {
					price = parseFloat(priceStr) * 1000;
				} else if (priceStr.indexOf(',') > 0) {
					price = parseFloat(priceStr.replace(',', '.'));
				}
			} else if (productBasketType === 'contracted') {
				var contractedInfo = $(".price-radio-contracted").find(".month-options.active");
				if(contractedInfo.length > 0){
					price = parseFloat(String(contractedInfo.data('price')).replace(',','.')) * parseFloat(contractedInfo.data('period'));
				} else {
					price = $(".price-radio-contracted").find(".a-price-val").html().replace(',','.');
				}
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
		return price;
	}
	
	function getProductBasketType() {
		var productBasketType = $(".product-basket-type:checked");
		if(productBasketType.length > 0) {
			var type = productBasketType.data('type');
			if(type) {
				return type;
			}
		}
		return '';
	}
	
	//  Sepete ekleme
	$(document).on('click', '.add-to-basket', function(e) {
		try {
			var type = getProductBasketType();
			if(type === 'cash') {
				addToBasket("Turkcell", type); // (Loginli - Pesin) sepete ekleme
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	});
	
	$('#none-login-sale-button').on('click', function(e){
		try {
			var type = getProductBasketType();
			if(type === 'cash') {
				addToBasket("Non-Turkcell", type); // (Loginsiz - Pesin) sepete ekleme
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	});
	
	
	$('#login-button').on('click', function(e) {
		try {
			var type = getProductBasketType();
			if(type === 'cash') {
				addToBasket("Turkcell", type); // (Login Popup ---> Login - Pesin) sepete ekleme
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	});
	
	$('#addToBasketContractedBtn').on('click', function(e) {
		try {
			var offerButton = $('.m-card--package--radio :checked');
			addToBasket("Turkcell", "contracted", offerButton); // Kontratli sepete ekleme
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	});
	
	function getSellerInformationJsonMap() {
    	try {
    		var deviceSellerInformationMapElement = $('#google-analytics-device-seller-informations');
        	if (deviceSellerInformationMapElement.length > 0) {
        		var informationMap = deviceSellerInformationMapElement.val();
        		if (informationMap != null && informationMap != undefined) {
        			return JSON.parse(informationMap);
        		}
        	}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
    	return null;
    }
	
	function getSellerInformationByPsiId(psiId, sellerInfoMap) {
    	try {
    		if (sellerInfoMap != null && sellerInfoMap != undefined) {
        		return sellerInfoMap[psiId];
        	}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
    	return null;
    }
	
	function insiderAddToBasket(product, sellerInformation, sellerJsonMap) {
		try {
			var insiderVal = $('#product-detail').data('productInsider');
			if (insiderVal != null && insiderVal != undefined) {
				insiderVal.color = product.dimension31;
				
				if (sellerInformation) {
					insiderVal.psiId = sellerInformation.psiId;
					insiderVal.promotionName = sellerInformation.analyticDiscountName; 
					insiderVal.promotionDiscount = sellerInformation.analyticDiscountRatio;

					insiderVal.price = sellerInformation.insiderPrice;
					insiderVal.priceAsString = sellerInformation.insiderPriceAsStr;
					insiderVal.salePrice = sellerInformation.insiderSalePrice;
					insiderVal.salePriceAsString = sellerInformation.insiderSalePriceAsStr;
					insiderVal.totalDiscount = sellerInformation.discountPrice;
					insiderVal.totalDiscountAsString = sellerInformation.discountPriceAsStr;

					if (sellerJsonMap != null && sellerJsonMap != undefined && sellerInformation.colorId != undefined && sellerInformation.colorId != null) {
						var groupedDataByGivenColorId = sellerInfosGroupByColorId(sellerJsonMap, sellerInformation.colorId);
						if (groupedDataByGivenColorId != null && groupedDataByGivenColorId != undefined) {
							insiderVal.detailstock = groupedDataByGivenColorId.map(item => item.amount).reduce((prev, next) => prev + next);
						}
					}
				}
				
				insiderVal = JSON.stringify(insiderVal);
				googleAnalyticLog(insiderVal, false, "insider-add-to-basket");
				if (isPassageInsiderActive === true) {
					if (typeof Android !== "undefined") {
						Android.itemAddedToCart(insiderVal);
					} else if(shm.is.deviceIOS()) {
						try {
							window.webkit.messageHandlers.itemAddedToCart.postMessage(insiderVal);
						} catch(err) {
							googleAnalyticLog("The native context does not exist yet", true, "insider-add-to-basket");
						}
					}
				}
			}
		} catch (e) {
			googleAnalyticLog(e, true, "insider-add-to-basket");
		}
	}
	
	function addToBasket(loginType, type, offerButton){
		try {
			googleAnalyticsObject = {};
			googleAnalyticsObject.event = 'addToCart';
			googleAnalyticsObject.eventCategory = 'ecommerce';
			googleAnalyticsObject.eventAction = 'Add To Cart';
			googleAnalyticsObject.ecommerce = {};
			googleAnalyticsObject.ecommerce.currencyCode = 'TRY';
			googleAnalyticsObject.ecommerce.add = {};
			googleAnalyticsObject.ecommerce.add.products = [];
			
			var product = {};
			var $deviceInformationElement = $('#product-detail').find('#google-analytics-device-informations');
			product = preparingCommonProductObject($deviceInformationElement);
			product.list = getDeviceInfoByTypeFromCookie(product.id, 'listName');
			product.position = getDeviceInfoByTypeFromCookie(product.id, 'position');
			product.quantity = 1;
			product.dimension30 = loginType;
			
			if(type === 'cash') {
				product.dimension25 = 'Pesin';
				product.dimension31 = $(".m-select-color").find("option:selected").html();
				product.dimension178 = $(".m-select-color").find("option:selected").val();
				var psiId = $('#google-analytics-device-selected-seller-informations').data('psiId');
				var sellerJsonMap = getSellerInformationJsonMap();
				var sellerInformation = getSellerInformationByPsiId(psiId, sellerJsonMap);
				if (sellerInformation != null && sellerInformation != undefined) {
					var priceStr = sellerInformation.outrightPrice;
					if (priceStr.indexOf('.') > 0) {
						product.price = parseFloat(priceStr) * 1000;
					} else if (priceStr.indexOf(',') > 0) {
						product.price = parseFloat(priceStr.replace(',', '.'));
					}
					product.dimension171 = sellerInformation.sellerId;
					product.dimension172 = sellerInformation.sellerName;
					insiderAddToBasket(product, sellerInformation, sellerJsonMap);
				}
			} else if(type === 'contracted' && offerButton) {
				var contractBuyType = offerButton.data('contractBuyType');
				product.dimension25 = contractBuyType === 'CONTRACTED' ? 'Kontratli' : 'Pesine Kontratli';
				product.price = offerButton.data('deviceOfferPrice');
				product.dimension26 = offerButton.data('obligationPeriod');
				product.dimension28 = offerButton.data('availableTariff');
				product.dimension29 = offerButton.data('packageName');
				product.dimension71 = offerButton.data('sellerId');
				product.dimension72 = offerButton.data('sellerName');
				insiderAddToBasket(product);
			}
			googleAnalyticsObject.ecommerce.add.products.push(product);
			googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
			dataLayer.push(googleAnalyticsObject);
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	// BasketLineItem Silme Islemleri
	
	var deleteProductInfo = {};
	
	// deleted basket line item holder
	$('.basket-line-item .icon-close').on('click', function(e){
		try {
			deleteProductInfo = {};
			var basketCardItem = $(this).closest('.basket-line-item');
			if(basketCardItem.length > 0) {
				deleteProductInfo.bliId = basketCardItem.data('productid');
				deleteProductInfo.basketId = basketCardItem.data('basketid');
				deleteProductInfo.basketType = basketCardItem.data('basketType');
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	});
	
	$('.js-count-down').on('click', function(){
		try {
			updateProductInfo = {};

			var $countInput = $($(this).closest('.m-counter')).find('.js-count');
			if ($countInput.length > 0) {
				var countInputVal = $countInput.val();
				if (countInputVal != null && countInputVal != undefined) {
					var value = parseInt(countInputVal);

					if (value === 0 || value === 1) {
						var basketCardItem = $(this).closest('.basket-line-item');
						if (basketCardItem.length > 0) {
							deleteProductInfo.bliId = basketCardItem.data('productid');
							deleteProductInfo.basketId = basketCardItem.data('basketid');
							deleteProductInfo.basketType = basketCardItem.data('basketType');
						}
					}else {
						var basketCardItem = $(this).closest('.basket-line-item');

						updateProductInfo.bliId = basketCardItem.data('productid');
						updateProductInfo.amount = value;

						insiderCountDownBasketLineItem(updateProductInfo);
					}
				}
			}
		} catch (e) {
		}
	});

	$('.js-count-up').on('click', function(){
		try {
			updateProductInfo = {};

			var $countInput = $($(this).closest('.m-counter')).find('.js-count');
			if ($countInput.length > 0) {
				var countInputVal = $countInput.val();
				if (countInputVal != null && countInputVal != undefined) {
					var value = parseInt(countInputVal);

					var basketCardItem = $(this).closest('.basket-line-item');

					updateProductInfo.bliId = basketCardItem.data('productid');
					updateProductInfo.amount = value;

					insiderCountUpBasketLineItem(updateProductInfo);
				}
			}
		} catch (e) {}
	});

	$('.js-card-delete-fav-btn').on('click' , function(){
		try {
			debugger
			deleteAndFavoriteProductInfo = {};

			var basketCardItem = $(this).closest('.basket-line-item');
			deleteAndFavoriteProductInfo.bliId = basketCardItem.data('productid');

			insiderDeleteAndFavoritedBasketLineItem(deleteAndFavoriteProductInfo);

		} catch (e) {}
	});
	
	$('body').delegate("#modal-delete .js-card-delete-btn", "click", function(e){
		try {
			if($(".basket-line-item").length > 0 && deleteProductInfo.bliId){
				deleteLineItem(deleteProductInfo);
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	});
	
	function deleteLineItem(deleteProductInfo){
		try {
			googleAnalyticsObject = {};
			googleAnalyticsObject.event = 'removeFromCart';
			googleAnalyticsObject.ecommerce = {};
			googleAnalyticsObject.ecommerce.remove = {};
			googleAnalyticsObject.ecommerce.remove.products = [];
			
			var deletedProductIds = [];
			if (deleteProductInfo.bliId && deleteProductInfo.basketType === 'CASH'){
				// bli bilgisi gelen cihazi sil (cash tekli)
				var product = {};
				product = preparingCommonProductObject($('#google-analytics-device-informations-'+ deleteProductInfo.bliId));
				product.list = getDeviceInfoByTypeFromCookie(product.id, 'listName');
				product.position = getDeviceInfoByTypeFromCookie(product.id, 'position');
				googleAnalyticsObject.ecommerce.remove.products.push(product);
				deletedProductIds.push(product.id);
				insiderDeleteBasketLineItem(product.id);
				
				var basketItems = $(".basket-line-item").filter('[data-basket-type="CASH"]');
				if (basketItems.length == 1) {
					insiderCartCleared();
				}
				
			} else {
				// (kontratli)
				$.each($(".basket-line-item").filter('[data-basket-type="'+ deleteProductInfo.basketType +'"]'), function(index, item){
					var product = {};
					product = preparingCommonProductObject($('#google-analytics-device-informations-'+$(item).data('productid')));
					product.list = getDeviceInfoByTypeFromCookie(product.id, 'listName');
					product.position = getDeviceInfoByTypeFromCookie(product.id, 'position');
					googleAnalyticsObject.ecommerce.remove.products.push(product);
					deletedProductIds.push(product.id);
					insiderDeleteBasketLineItem(product.id);
				});
				
				insiderCartCleared();
			}
			
			var jsonStrObj = getObjectFromSessionStorage('checkoutGoogleAnalyticsObject' + deleteProductInfo.basketId);
			if(jsonStrObj != null && jsonStrObj != undefined && !isEmpty(jsonStrObj)){
				var checkoutObj = JSON.parse(jsonStrObj);
				if(checkoutObj != null && checkoutObj != undefined){
					deletedProductIds.forEach(function(i, index){
						checkoutObj.ecommerce.checkout.products = checkoutObj.ecommerce.checkout.products.filter(function(item) {
							return item.id != i
						});
					})
					putObjectToSessionStorage('checkoutGoogleAnalyticsObject'+ deleteProductInfo.basketId, checkoutObj);
				}
			}
			
			googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
			dataLayer.push(googleAnalyticsObject);
			
			// clear deleted product infos
			deleteProductInfo = {};
			
		} catch (e) {
			googleAnalyticLog(e, true);
		}
		
	}

	function insiderDeleteAndFavoritedBasketLineItem(productId) {
		sendBasketEvents(productId,"deleteAndFavorited");
	}

	function insiderCountDownBasketLineItem(productId) {
		sendBasketEvents(productId,"countDown");
	}

	function insiderCountUpBasketLineItem(productId) {
		sendBasketEvents(productId,"countUp");
	}

	function sendBasketEvents(productId,event){

		try {
			if (productId != undefined && productId != null) {
				productId = productId.toString()

				if (isPassageInsiderActive === true) {
					if (typeof Android !== "undefined") {

						if(event === "countUp"){
							Android.itemCountUpCart(productId);

						}
						else if(event === "countDown"){
							Android.itemCountDownCart(productId);

						}
						else if(event === "deleteAndFavorited"){
							Android.itemDeletedandFavoritedCart(productId);

						}
					} else if(shm.is.deviceIOS()) {
						try {
							if(event === "countUp"){
								window.webkit.messageHandlers.itemCountUpCart.postMessage(productId);

							}
							else if(event === "countDown"){
								window.webkit.messageHandlers.itemCountDownCart.postMessage(productId);

							}
							else if(event === "deleteAndFavorited"){
								window.webkit.messageHandlers.itemDeletedandFavoritedCart.postMessage(productId);
							}

						} catch(err) {}
					}
				}
			}
		} catch (e) {}
	}
	
	function insiderCartCleared() {
		try {
			googleAnalyticLog('success', false, "basket-cleared-insider");
			if (isPassageInsiderActive === true) {
				if (typeof Android !== "undefined") {
					Android.cartCleared("Success");
				} else if(shm.is.deviceIOS()) {
					try {
						window.webkit.messageHandlers.cartCleared.postMessage("Success");
					} catch(err) {
						googleAnalyticLog("The native context does not exist yet", true, "basket-cleared-insider");
					}
				}
			}
		} catch (e) {
			googleAnalyticLog(e, true, "basket-cleared-insider");
		}
	}
	
	function insiderDeleteBasketLineItem(productId) {
		try {
			if (productId != undefined && productId != null) {
				productId = productId.toString()
				googleAnalyticLog(productId, false, "basket-delete-line-item-insider");
				if (isPassageInsiderActive === true) {
					if (typeof Android !== "undefined") {
						Android.itemRemovedFromCart(productId);
					} else if(shm.is.deviceIOS()) {
						try {
							window.webkit.messageHandlers.itemRemovedFromCart.postMessage(productId);
						} catch(err) {
							googleAnalyticLog("The native context does not exist yet", true, "basket-delete-line-item-insider");
						}
					}
				}
			}
		} catch (e) {
			googleAnalyticLog(e, true, "basket-delete-line-item-insider");
		}
	}
	
	// CheckoutSteps
	if($('.google-analytics-checkout-steps').length > 0){
		try {
			$.each($('.google-analytics-checkout-steps'), function(index, basket){
				checkoutSteps($(basket));
			});
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	// Satin Alma Adimlari
	function checkoutSteps(basket){
		try {
			googleAnalyticsObject = {};
			var basketId = basket.data('basketId'), isContracted = basket.data('isContracted'), stepId = basket.data('analyticStep');
			pushEventsToDataLayer(basket);
			if(stepId != '1') {
				var jsonStrObj = getObjectFromSessionStorage('checkoutGoogleAnalyticsObject' + basketId);
				if(jsonStrObj != null && jsonStrObj != undefined && !isEmpty(jsonStrObj)){
					googleAnalyticsObject = JSON.parse(jsonStrObj);
					if(googleAnalyticsObject != null && googleAnalyticsObject != undefined){
						googleAnalyticsObject.ecommerce.checkout.actionField.step = stepId;
					}
				}
			} else {
				googleAnalyticsObject.event = 'checkout';
				googleAnalyticsObject.eventCategory = 'ecommerce';
				googleAnalyticsObject.eventAction = 'Checkout';
				googleAnalyticsObject.ecommerce = {};
				googleAnalyticsObject.ecommerce.checkout = {};
				googleAnalyticsObject.ecommerce.checkout.actionField = {};
				googleAnalyticsObject.ecommerce.checkout.products = [];
				googleAnalyticsObject.ecommerce.checkout.actionField.step = stepId;
				
				var deviceList = isContracted ? $('.google-analytics-device-contracted').filter('[data-basket-id="'+ basketId +'"]') : $('.google-analytics-basket-line').filter('[data-basket-id="'+ basketId +'"]');
				$.each(deviceList, function(index, deviceDiv){
					var product = preparingCommonProductObject($(deviceDiv));
					product.list = getDeviceInfoByTypeFromCookie(product.id, 'listName');
					product.position = getDeviceInfoByTypeFromCookie(product.id, 'position');
					googleAnalyticsObject.ecommerce.checkout.actionField.option = "basketId=" + $(deviceDiv).data('basketId');
					googleAnalyticsObject.ecommerce.checkout.products.push(product);
				});
				
				if (stepId == '1') {
					insiderBasketPage(basket);	
				}
				
			}

			if(stepId != '1'){
				var checkoutInformations = $('#google-analytics-checkout-informations');
				googleAnalyticsObject.ecommerce.checkout.installmentNo = checkoutInformations.data('installmentNo');
				googleAnalyticsObject.ecommerce.checkout.bankName = checkoutInformations.data('bankConnectionName');
				googleAnalyticsObject.ecommerce.checkout.newCartAdded = checkoutInformations.data('newCartAdded');
			}

			if(putObjectToSessionStorage('checkoutGoogleAnalyticsObject'+ basketId, googleAnalyticsObject)){
				googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
				dataLayer.push(googleAnalyticsObject);
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}

	function pushEventsToDataLayer(basket){
		var stepId = stepId = basket.data('analyticStep');
		if(stepId != '1'){
			if(stepId == '2') {
				const obj = {}
				obj.event = 'begin_checkout'
				dataLayer.push(obj)
			}

			if(stepId == '3' || basket.data('paymentMethod') == 'Kontratlı') {
				const obj = {}
				obj.event = 'add_shipping_info'
				obj.shippingMethod = basket.data('shippingMethod');
				obj.shippingPrice = basket.data('shipping');
				dataLayer.push(obj)
			}

			if(stepId == '4') {
				const obj = {}
				obj.event = 'add_payment_info';
				obj.installmentNo = basket.data('installmentNo');
				obj.bankName = basket.data('bankConnectionName');
				obj.newCartAdded = basket.data('newCartAdded');
				obj.paymentMethod = basket.data('paymentMethod');
				obj.shippingMethod = basket.data('shippingMethod');
				obj.shippingPrice = basket.data('shipping');
				dataLayer.push(obj)
			}
		}
	}

	function insiderBasketPage(basketForm) {
		try {
			var insiderValue = basketForm.data('basketPageInsider');
			if (insiderValue != null && insiderValue != undefined) {
				insiderValue = JSON.stringify(insiderValue);
				googleAnalyticLog(insiderValue, false, "basket-page-insider");
				if (isPassageInsiderActive === true) {
					if (typeof Android !== "undefined") {
						Android.visitCartPage(insiderValue);
					} else if(shm.is.deviceIOS()) {
						try {
							window.webkit.messageHandlers.visitCartPage.postMessage(insiderValue);
						} catch(err) {
							googleAnalyticLog("The native context does not exist yet", true, "basket-page-insider");
						}
					}
				}
			}	
		} catch (e) {
			googleAnalyticLog(e, true, "basket-page-insider");
		}
	}
	
	// Siparis Sonlandirma
	if($('.google-analytics-checkout-steps').length > 0 && $('.google-analytics-checkout-steps').data('analyticStep') == 4) {
		$('.google-analytics-review-continue').on('click', function(){
			try {
				var notChecked = $(".m-basket-summary__body input:checkbox:not(:checked)");
				if(notChecked.length == 0) {
					finishPayment();
				}
			} catch (e) {
				googleAnalyticLog(e, true);
			}
		});
	} 
	
	// Purchase islemleri
	function finishPayment(){
		try {
			var checkoutInformations = $('#google-analytics-checkout-informations');
			if(checkoutInformations.length > 0) {
				var basketId = checkoutInformations.data('basketId'), isContracted = checkoutInformations.data('isContracted'); 
				removeObjectFromSessionStorage('googleAnalyticsPaymentObject' + basketId);
				removeObjectFromSessionStorage('insiderPurchaseProducts' + basketId);
				
				if(checkoutInformations.length > 0){
					googleAnalyticsObject = {};
					googleAnalyticsObject.shippingMethod = checkoutInformations.data('shippingMethod');
					googleAnalyticsObject.paymentMethod = checkoutInformations.data('paymentMethod');
					googleAnalyticsObject.isWithDiscountCoupon = checkoutInformations.data('isWithDiscountCoupon');
					googleAnalyticsObject.creditCardType = checkoutInformations.data('bankConnectionName');
                    googleAnalyticsObject.dimension180 = checkoutInformations.data('cardType');
					googleAnalyticsObject.installmentNo = checkoutInformations.data('installmentNo');
					googleAnalyticsObject.bankName = checkoutInformations.data('bankConnectionName');
					googleAnalyticsObject.newCartAdded = checkoutInformations.data('newCartAdded');
					googleAnalyticsObject.ecommerce = {};
					googleAnalyticsObject.event = 'purchase';
					googleAnalyticsObject.eventCategory = 'ecommerce';
					googleAnalyticsObject.eventAction = 'Purchase';
					googleAnalyticsObject.ecommerce.purchase = {};
					googleAnalyticsObject.ecommerce.purchase.actionField = {};
					googleAnalyticsObject.ecommerce.purchase.products = [];
					
					googleAnalyticsObject.ecommerce.purchase.actionField.id = '';
					googleAnalyticsObject.ecommerce.purchase.actionField.revenue = checkoutInformations.data('revenue');
					googleAnalyticsObject.ecommerce.purchase.actionField.shipping = checkoutInformations.data('shipping');
					googleAnalyticsObject.ecommerce.purchase.actionField.coupon = checkoutInformations.data('coupon');

					var deviceList = isContracted ? $('.google-analytics-device-contracted').filter('[data-basket-id="'+ basketId +'"]') : $('.google-analytics-basket-line').filter('[data-basket-id="'+ basketId +'"]');
					$.each(deviceList, function(index, deviceDiv){
						var product = preparingCommonProductObject($(deviceDiv));
						product.list = getDeviceInfoByTypeFromCookie(product.id, 'listName');
						product.position = getDeviceInfoByTypeFromCookie(product.id, 'position');
						googleAnalyticsObject.ecommerce.purchase.products.push(product);
					});
					googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
					
					putObjectToSessionStorage('googleAnalyticsPaymentObject' + basketId, googleAnalyticsObject);
					prepareInsiderBasketPurchased(checkoutInformations, basketId);
				}
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function prepareInsiderBasketPurchased(checkoutInformations, basketId) {
		try {
			var insiderProductItems = checkoutInformations.data('purchaseInsider');
			if (insiderProductItems != undefined && insiderProductItems != null && insiderProductItems.length > 0) {
				putObjectToSessionStorage('insiderPurchaseProducts' + basketId, insiderProductItems);
			}
		} catch (e) {
			googleAnalyticLog(e, true, "item-purchase-insider");
		}
	}
	
	function insiderBasketItemPurchased(basketId, orderId) {
		try {
			var insiderProductItemsJsonStr = getObjectFromSessionStorage('insiderPurchaseProducts' + basketId);
			if(insiderProductItemsJsonStr != null && insiderProductItemsJsonStr != undefined && !isEmpty(insiderProductItemsJsonStr)){
				var insiderProductItems = JSON.parse(insiderProductItemsJsonStr);
				if(insiderProductItems != null && insiderProductItems != undefined && insiderProductItems.length > 0) {
					var purchase = {};
					purchase.products = [];
					purchase.products = insiderProductItems;
					purchase.saleId = orderId;
					purchase = JSON.stringify(purchase)
					googleAnalyticLog(purchase, false, "basket-purchase-insider");
					if (isPassageInsiderActive === true) {
						if (typeof Android !== "undefined") {
							Android.itemPurchased(purchase);
						} else if(shm.is.deviceIOS()) {
							try {
								window.webkit.messageHandlers.itemPurchased.postMessage(purchase);
							} catch(err) {
								googleAnalyticLog("The native context does not exist yet", true, "basket-purchase-insider");
							}
						}
					}
				}
			}
			removeObjectFromSessionStorage('insiderPurchaseProducts' + basketId);
		} catch (e) {
			googleAnalyticLog(e, true, "basket-purchase-insider");
		}
	}
	
	// Order success & fail event
	if($('#google-analytics-confirmation-success').length > 0){
		try {
			var orderCompletedInfo = $('#google-analytics-confirmation-success'),
			orderId = orderCompletedInfo.data('orderId'), 
			isContract = orderCompletedInfo.data('isContract'), 
			basketId = orderCompletedInfo.data('basketId'),
			jsonStr = getObjectFromSessionStorage('googleAnalyticsPaymentObject' + basketId);

			insiderBasketItemPurchased(basketId, orderId);
			if (jsonStr != null && jsonStr != undefined && !isEmpty(jsonStr)) {
				var googleAnalyticsObject = JSON.parse(jsonStr);
				if(googleAnalyticsObject != null && googleAnalyticsObject != undefined){
					googleAnalyticsObject.ecommerce.purchase.actionField.id = orderId;
					googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
					dataLayer.push(googleAnalyticsObject);
					removeObjectFromSessionStorage('checkoutGoogleAnalyticsObject' + basketId);
					removeObjectFromSessionStorage('googleAnalyticsPaymentObject' + basketId);
					insiderOrderStart(googleAnalyticsObject.ecommerce.purchase.actionField.revenue);
					sendOrderResultEvent("Success");
				}
			}
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function insiderOrderStart(totalPrice) {
		try {
			if (totalPrice != null && totalPrice != undefined) {
				totalPrice = parseFloat(totalPrice);
				googleAnalyticLog(totalPrice, false, "order-start-insider");
				if (isPassageInsiderActive === true) {
					if (typeof Android !== "undefined") {
						Android.orderStart(totalPrice);
					} else if(shm.is.deviceIOS()) {
						try {
							window.webkit.messageHandlers.orderStart.postMessage(totalPrice);
						} catch(err) {
							googleAnalyticLog("The native context does not exist yet", true, "order-start-insider");
						}
					}
				}
			}
		} catch (e) {
			googleAnalyticLog(e, true, "order-start-insider");
		}
	}
	

	// Send data to GA for add to favorite operation
	$('.a-fav-button').on('click', function(e){
		try {
			var target = $(e.target);
			googleAnalyticsObject = {};
			googleAnalyticsObject.event = 'GAEvent';
			googleAnalyticsObject.eventCategory = 'Functions';
			googleAnalyticsObject.eventAction = target.hasClass('heart-fill') ?  'removeFavorite' : 'addFavorite';
			googleAnalyticsObject.eventLabel = target.closest('div').data('pm-name');
			googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
			dataLayer.push(googleAnalyticsObject);
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	});

	// Send data to GA for share operation
	$('.icon-p-share').on("click", function (e) {
		e.preventDefault();
		try {
			var $deviceInformationElement = $('#product-detail').find('#google-analytics-device-informations');
			product = preparingCommonProductObject($deviceInformationElement);

			googleAnalyticsObject = {};
			googleAnalyticsObject.event = 'ProductShare';
			googleAnalyticsObject.eventCategory = 'EcomProductShare';
			googleAnalyticsObject.eventAction = 'ShareClick';
			googleAnalyticsObject.eventLabel = product.name;
			if (googleAnalyticsObject.eventLabel === '' || googleAnalyticsObject.eventLabel === undefined) {
				googleAnalyticsObject.eventLabel = $('.product-detail__coming-soon-title').html()
			}

			googleAnalyticsObject.ecommerce = {};
			googleAnalyticsObject.ecommerce.detail = {};
			googleAnalyticsObject.ecommerce.detail.productId = product.id;

			googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
			dataLayer.push(googleAnalyticsObject);
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	});


	if($('#google-analytics-basket-error').length > 0){
		try {
			var errorLbl = $('#google-analytics-basket-error').text();
			sendOrderResultEvent("Failure", errorLbl);
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function sendOrderResultEvent(eventAction, eventLabel){
		try {
			googleAnalyticsObject = {};
			googleAnalyticsObject.eventCategory = "Transaction";
			googleAnalyticsObject.eventAction= eventAction;
			googleAnalyticsObject.eventLabel= eventLabel;
			googleAnalyticsObject.event= "GAEvent";
			googleAnalyticLog(JSON.stringify(googleAnalyticsObject));
			dataLayer.push(googleAnalyticsObject);
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	// Order success & fail event
	
	function preparingCommonProductObject($deviceInformationElement){
		try {
			var product = {};
			product.id = $deviceInformationElement.data('productId');
			product.name = $deviceInformationElement.data('productName');
			product.price = $deviceInformationElement.data('productPrice');
			product.brand = $deviceInformationElement.data('productBrand');
			product.category = $deviceInformationElement.data('productCategory');
			product.coupon = $deviceInformationElement.data('productCoupon');
			product.variant = $deviceInformationElement.data('variant'); 
			product.quantity = $deviceInformationElement.data('quantity');
			product.list = $deviceInformationElement.data('sectionTitle');
			product.position = $deviceInformationElement.data('position');
			product.dimension21 = $deviceInformationElement.data('dimension21');
			product.dimension22 = $deviceInformationElement.data('dimension22');
			product.dimension23 = $deviceInformationElement.data('dimension23') || "0";
			product.dimension25 = $deviceInformationElement.data('dimension25');
			product.dimension26 = $deviceInformationElement.data('dimension26');
			product.dimension27 = $deviceInformationElement.data('dimension27');
			product.dimension28 = $deviceInformationElement.data('dimension28');
			product.dimension29 = $deviceInformationElement.data('dimension29');
			product.dimension30 = $deviceInformationElement.data('dimension30');
			product.dimension31 = $deviceInformationElement.data('dimension31');
			product.dimension145 = $deviceInformationElement.data('dimension145');
			product.dimension156 = $deviceInformationElement.data('dimension156');
			product.dimension157 = $deviceInformationElement.data('dimension157');
			product.dimension167 = $deviceInformationElement.data('dimension167');
			product.dimension168 = $deviceInformationElement.data('dimension168');
			product.dimension169 = $deviceInformationElement.data('dimension169');
			product.dimension170 = $deviceInformationElement.data('dimension170');
			product.dimension171 = $deviceInformationElement.data('dimension171');
			product.dimension172 = $deviceInformationElement.data('dimension172');
			product.dimension173 = $deviceInformationElement.data('dimension173');
			product.dimension174 = $deviceInformationElement.data('dimension174');
			product.dimension175 = $deviceInformationElement.data('dimension175');
			product.dimension178 = $deviceInformationElement.data('dimension178');
			return product;
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
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
	
	function getDeviceInfoByTypeFromCookie(deviceId, type){
		var deviceListMap = getDeviceListMapFromCookie();
		// cookie'den cihazin hangi listeye ait oldugunun bulunmasi
		var deviceListInfo = deviceListMap[deviceId];
		if(deviceListInfo != null && deviceListInfo != undefined){
			var deviceInfoArr = deviceListInfo.split('#');
			if(deviceInfoArr != null && deviceInfoArr != null && deviceInfoArr.length > 0){
				if(type === 'listName' && !isEmpty(deviceInfoArr[0])) {
					return deviceInfoArr[0];
				} else if(type === 'position' && !isEmpty(deviceInfoArr[1])){
					return deviceInfoArr[1];
				}
			}
		}
		return deviceListInfo;
	}
	
	// get javascript map from cookie
	function getDeviceListMapFromCookie(){
		try {
			var deviceListMap = $.cookie('deviceListMap');
			if(deviceListMap == null || deviceListMap == undefined || deviceListMap.length == 0){
				deviceListMap = new Map();
			} else{
				deviceListMap = JSON.parse(deviceListMap);
			}
			return deviceListMap;
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	// put javascript map to cookie
	function putDeviceListMapIntoCookie(key, value) {
		try {
			var deviceListMap = getDeviceListMapFromCookie();
			deviceListMap[key] = value;
			$.cookie('deviceListMap', JSON.stringify(deviceListMap), { expires: 1 , path: '/'});
			return deviceListMap;
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function getObjectFromSessionStorage(key){
		try {
			if (sessionStorageCompatibility()) {
				var jsonStrObj = sessionStorage.getItem(key);
				return jsonStrObj;
			}
			return null;
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function putObjectToSessionStorage(key, value){
		try {
			if (sessionStorageCompatibility()) {
				sessionStorage.setItem(key, JSON.stringify(value));
				return true;
			}
			return false;
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function removeObjectFromSessionStorage(key){
		try {
			if (sessionStorageCompatibility()) {
				sessionStorage.removeItem(key);
				return true;
			}
			return false;
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function sessionStorageCompatibility(){
		try {
			return true;
		} catch (e) {
			googleAnalyticLog(e, true);
		}
	}
	
	function googleAnalyticLog(message, isError, logPrefix){
		try {
			logPrefix = logPrefix || "google-analytics-mobile-log"; 
			if(isProdMode === false || isError === true) {
				console.log(logPrefix + " = " + message);
			}
		} catch (e) {
			console.log(e);
		}
	}
	
	function isEmpty(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}
	
});

function googleAnalyticLogWithoutPrefix(message, isError) {
	if(isProdMode !== undefined && (isProdMode === false || isError === true)) {
		console.log("google-analytics-log" + " = " + message);
	}
}

async function getCancelOrReturnAnalyticsDataAndPush() {
	try {
		dataLayer.push({ecommerce: null}); // clear the previous ecommerce object
		const googleAnalyticsObject = await getGoogleAnalyticsObject();
		googleAnalyticLogWithoutPrefix(JSON.stringify(googleAnalyticsObject));
		dataLayer.push(googleAnalyticsObject);
	} catch (e) {
		googleAnalyticLogWithoutPrefix(e, true);
	}
}

async function getGoogleAnalyticsObject() {
	const googleAnalyticsObject = {};
	const analyticsObject = $('#google-analytics-refund-order-informations');
	const itemObjects = $('#google-analytics-refund-product-informations');
	googleAnalyticsObject.event = 'refund';
	googleAnalyticsObject.ecommerce = {};
	googleAnalyticsObject.ecommerce.currency = 'TRY';
	googleAnalyticsObject.ecommerce.transaction_id = analyticsObject.data('transactionId');
	googleAnalyticsObject.ecommerce.value = analyticsObject.data('value');
	googleAnalyticsObject.ecommerce.shipping = analyticsObject.data('shipping');
	googleAnalyticsObject.ecommerce.dimension182 = analyticsObject.data('dimension182');
	googleAnalyticsObject.ecommerce.location_id = await getGoogleMapsPlaceId(analyticsObject);
	googleAnalyticsObject.ecommerce.items = [];

	[...itemObjects].forEach(function (value) {
		const itemObject = getGoogleAnalyticsObjectItem(value);
		googleAnalyticsObject.ecommerce.items.push(itemObject);
	});
	return googleAnalyticsObject;
}

function getGoogleAnalyticsObjectItem(itemObject) {
	const item = {};
	const $itemObject = $(itemObject);
	item.item_id = $itemObject.data('itemId');
	item.item_name = $itemObject.data('itemName');
	item.affiliation = 'Pasaj Online Store';
	item.coupon = $itemObject.data('coupon');
	item.discount = $itemObject.data('discount');
	item.index = $itemObject.data('index');
	item.item_brand = $itemObject.data('itemBrand');
	item.item_category = $itemObject.data('itemCategory');
	item.item_category2 = $itemObject.data('itemCategory2');
	item.item_category3 = $itemObject.data('itemCategory3');
	item.item_category4 = $itemObject.data('itemCategory4');
	item.item_list_id = $itemObject.data('itemListId');
	item.item_list_name = $itemObject.data('itemListName');
	item.item_variant = $itemObject.data('itemVariant');
	item.price = $itemObject.data('price');
	item.quantity = $itemObject.data('quantity');
	item.shippingMethod = $itemObject.data('shippingMethod');
	item.paymentMethod = $itemObject.data('paymentMethod');
	item.isWithDiscountCoupon = $itemObject.data('isWithDiscountCoupon');
	item.creditCardType = $itemObject.data('creditCardType');
	item.dimension22 = $itemObject.data('dimension22');
	item.dimension25 = $itemObject.data('dimension25');
	item.dimension30 = $itemObject.data('dimension30');
	item.dimension145 = $itemObject.data('dimension145');
	item.dimension156 = $itemObject.data('dimension156');
	item.dimension157 = $itemObject.data('dimension157');
	item.dimension167 = $itemObject.data('dimension167');
	item.dimension168 = $itemObject.data('dimension168');
	item.dimension169 = $itemObject.data('dimension169');
	item.dimension170 = $itemObject.data('dimension170');
	item.dimension171 = $itemObject.data('dimension171');
	item.dimension172 = $itemObject.data('dimension172');
	item.dimension178 = $itemObject.data('dimension178');
	item.dimension180 = $itemObject.data('dimension180');
	return item;
}

async function getGoogleMapsPlaceId(analyticsObject) {
	const latitude = analyticsObject.data('latitude');
	const longitude = analyticsObject.data('longitude');
	const apiKey = analyticsObject.data('apiKey');
	if (!latitude || !longitude || !apiKey) return '';
	const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=${apiKey}`;

	try {
		const response = await fetch(url);
		const json = response.json();
		if (json.results.length >= 1) {
			return json.results[0].place_id;
		}
		return '';
	} catch (e) {
		googleAnalyticLogWithoutPrefix(e, true);
		return '';
	}
}