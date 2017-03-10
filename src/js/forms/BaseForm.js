
function form(title, template, table, id) {  

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

 
            var v3 = $("input[name='v3']").val();
            var v7 = $("input[name='v7']").val();
            console.log(v7);
            if(typeof( parseInt(v3) )=="number" && v7!=undefined){
                console.log(v7);
                if(v7!='' && v7!=undefined){
                showPubs(v7);
              }
                if(v7!=''){
                window.location.href = "/?companyid="+v7;
                }
            }
 
 
            var companyid = $("input[name='companyid']").val();
            if(typeof( parseInt(companyid) )=="number" ){
              if(companyid!='' && companyid!=undefined){
                showPubs(companyid);
                }
            } 
var operation = $("input[name='operation']").val();

if(operation=='addClient'){
  console.log(operation);
  updata();
  setTimeout(function(){
    $('#variants').html(
        $('#variants_options').render(CLIENTS)
    );
  },1000);
$('#client_variants').val($("input[name='v1']").val());
$('#clientnow').text($("input[name='v1']").val());
headClear();
}


        }

    });


}
