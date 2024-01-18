$(document).ready(function () {
    $('#create_db span').click(function (e) {
        e.preventDefault();
        $('#create_db div').slideToggle();

    });
    $('#db_confirm').click(function (e) {
        let input = $('#db_name_input').val();
        var database = $('<div>').text(input).addClass('button database');

        $('#db_container').append(database.hide().fadeIn(1000));
        $('#create_db div').slideToggle();
    });
});
