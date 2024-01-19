$(function () {

    //Makes the input field to the name of the new database 
    $('#create_db span').on('click', function (e) {
        $('#create_db div').slideToggle();
    });
    $('#db_confirm').on('click', function (e) {
        let input = $('#db_name_input').val();
        var database = $('<div>').text(input).addClass('button database');

        $('#db_container').append(database.hide().fadeIn(1000));
        $('#create_db div').slideToggle();
    });
    var term = $('#terminal').terminal(function (command) {
        console.log(typeof command);
    }, {
        greetings: 'Welcome to the terminal, insert your query.'
    });
});