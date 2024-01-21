let currentDatabase;

$(function () {

    //Gets all the created databases.
    $.post('/api/query', { query: 'SHOW DATABASES' }, function (response) {
        for (i in response) {
            console.log(response[i]);
            $('#db_container').append(createDB(response[i].Database).hide().fadeIn(1000));
        }
    })


    //Makes the input field to the name of the new database toggle between visible and hidden.
    $('#create_db span').on('click', function (e) {
        $('#create_db div').slideToggle();
    });

    //Add the confirmation button of the DB Creation.
    $('#db_confirm').on('click', function (e) {

        //Gets the value of the input field with the db name.
        let input = $('#db_name_input').val();
        const database = createDB(input);

        //Post request with the data base name as a parameter.
        $.post('/api/create', { databaseName: input }, function (response) {

            //Appends the database to the left bar if it's creation was succesful.
            console.log('Success:', response);
            $('#db_container').append(database.hide().fadeIn(1000));
            $('#create_db div').slideToggle();

        }).fail(function (error) {
            //If it wasn't successful, prints the error message on the termina.
            const errorMessage = JSON.parse(error.responseText);
            term.echo('[[;red;]' + errorMessage.error)
        });

    });

    var term = $('#terminal').terminal(function (command) {

        //Get's the command input of the terminal and post it as a query string.
        $.post('/api/query', { query: command, databaseName: currentDatabase }, function (response) {
            console.log('Success:', response);
        }).fail(function (error) {
            const errorMessage = JSON.parse(error.responseText);
            term.echo('[[;red;]' + errorMessage.error)
        });

    }, {
        greetings: 'Welcome to the terminal, insert your query.',
        prompt: 'SQL>'
    });


});

function createDB(name) {
    var database = $('<div>').text(name).addClass('button database');

    //Adds the click listener to the database button.
    database.on('click', function (e) {
        //Gets the name of the current selected database.
        currentDatabase = $(this).text();

        //Remove the selection from the other selected database.
        $('.selected').removeClass('selected');

        //Adds the selection to the new selected database.
        $(this).addClass('selected');
    })
    return database;
}