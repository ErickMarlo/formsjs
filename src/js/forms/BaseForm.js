
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
