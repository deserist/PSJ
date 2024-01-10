$(document).ready(function () {
    const button = $('.js-add-basket');
    const productId = button.attr('data-id');
    let action = 'addBasket';
    button.on('click', function () {
        button.attr('disabled', true);
        button.html('<i class="fa fa-spinner fa-spin"></i> Ekleniyor...');
        $.ajax({
            url: '/sadece-online-ozel/ajax.php',
            type: 'POST',
            data: JSON.stringify({productId, action}),
            contentType: 'application/json',
            success: function (response) {
                let res = JSON.parse(response);
                if (res.status) {
                    button.html('<i class="icon-sepetekle"></i> Sepete Eklendi');
                    setTimeout(function () {
                        window.location.href = '/sadece-online-ozel/sepetim.php';
                    }, 1500);
                } else {
                    alert(res.message);
                    button.html('<i class="icon-sepetekle"></i> Sepete Ekle');
                    button.attr('disabled', false);
                }
            }
        })
    })
    const removeButton = $('.js-remove-product');
    let removeAction = 'removeBasket';
    removeButton.on('click', function () {
        if (confirm('Ürünü sepetten çıkarmak istediğinize emin misiniz?')) {
            $.ajax({
                url: '/sadece-online-ozel/ajax.php',
                type: 'POST',
                data: JSON.stringify({action: removeAction}),
                contentType: 'application/json',
                success: function (response) {
                    let res = JSON.parse(response);
                    if (res.status) {
                        setTimeout(function () {
                            window.location.href = '/sadece-online-ozel/';
                        }, 1500);
                    } else {
                        alert(res.message);
                    }
                }
            })
        } else {
            return false;
        }
    })
})