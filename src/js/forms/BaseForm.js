
//==+==---------------------------------------------------------==+==

function form(title, template, table, id) { // t is table

    $('#modal-form .modal-title').text(title);
    $('#myModal').modal('show');

    if (!table && !id) {
        $('#modal-form .modal-body').html(
            $("#" + template).render({})
        );
    }

    setTimeout(function () {
        $("#modal-form input[name='v1'] ").focus();
    }, 200);

    if (table && id) {
        console.log(11);
        rest('getid', table, function (rows) {
            console.log(10);
            $('#modal-form .modal-body').html(
                $("#" + template).render(rows)
            );
        }, id);
        console.log(12);
    }

    $('#moreinputs').html('');
}

//==+==---------------------------------------------------------==+==
function formSubmit() {

    event.preventDefault();
    var inputs = $('#modal-form').serialize();

    $.post('ajax.php', inputs, 'json').done(function (data) {

        if (data.status == 'error') {

            $('#myModal').modal('show');
            $('#myModal .alert-danger').slideToggle();
            $('#myModal .alert-danger span').html(' <b>' + data.statusd + '</b> Попробуйте еще раз.');

            setTimeout(function () {
                $('#myModal .alert-danger').slideToggle();
                $('#myModal .alert-danger span').text('');
            }, 5000)
        } else {
            if (data.statusd == 'Успешный вход') {
                window.location.href = "/";
            }
            if (data.statusd == 'Успешная регистрация') {
                form('Успешная регистрация. Можете войти', 'login')
            }
        }

    });
}
