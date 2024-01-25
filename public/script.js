let currentDatabase;
var term;

//onLoad function.
$(function () {

    //Makes the input field to the name of the new database toggle between visible and hidden.
    $('#create_db span').on('click', function (e) {
        $('#create_db div').slideToggle();
    });

    //Gets all the already existing databases and adds them to the screen.
    postQuery("SHOW DATABASES").done(
        function (response) {
            for (i in response) {
                $('#db_container').append(createDB(response[i].Database).hide().fadeIn(1000));
            }
        })

    //Add the confirmation button of the DB Creation.
    $('#db_confirm').on('click', function (e) {

        //Gets the value of the input field with the db name.
        let input = $('#db_name_input').val();

        //Does the post query.
        postCreateQuery(input).done(function (response) {
            console.log('Success:', response);

            //If the post was succesfully, create the database element and append it to the database container.
            $('#db_container').append(createDB(input).hide().fadeIn(1000));
            $('#create_db div').slideToggle();
            $('#db_name_input').val('');

        }).fail(function (error) {
            printErrorOnTerminal(error);
        });
    });

    term = $('#terminal').terminal(function (command) {

        //Get's the command input of the terminal and post it as a query string.
        postQuery(command, currentDatabase).done(
            function (response) {
                console.log('Success:', response);
            })
            .fail(function (error) {
                printErrorOnTerminal(error);
            });

    }, {
        greetings: 'Welcome to the terminal, insert your query.',
        prompt: 'SQL>'
    });

});

//Returns a database element to be inserted into the leftbar.
function createDB(name) {
    var database = $('<div>').text(name).addClass('button database');

    //Adds the click listener to the database button.
    database.on('click', function (e) {
        //Gets the name of the current selected database.
        currentDatabase = $(this).text();

        //Remove the selection from the other selected database.
        $('.selected').removeClass('selected');

        //Clean the table.
        $('#table_fields').empty();
        $('#table_data').empty();

        //Adds the selection to the new selected database.
        $(this).addClass('selected');
        getTables(currentDatabase);
    })
    return database;
}

//Post request to get all the tables from the current database.
function getTables(database) {

    //Does a post query to get all the tables from a database.
    postQuery("SHOW TABLES", database).done(
        function (response) {

            //Remove all the tables currently being shown.
            $('#table_bar').find('div').remove();

            //Loops through the response and gets the name of all the tables.
            for (let i = 0; i < response.length; i++) {
                const tableName = response[i]["Tables_in_" + database];

                var table = $('<div>').addClass('table').on('click', function (e) {

                    //Remove the selection of any other table and set the current as selected.
                    $('#table_bar .selected').removeClass('selected');
                    $(this).addClass('selected');

                    //Update the table data.
                    getTableData(tableName);
                });

                //Creates the span with the table name.
                var table_name_span = $('<span>').text(tableName).addClass('table_name');
                table.append(table_name_span);

                //Append the new table to the table bar with a animation.
                $('#table_bar').append(table.hide().fadeIn(1000));
            }
        })
        .fail(function (error) {
            printErrorOnTerminal(error);
        })
}

function getTableData(table) {
    $('#table_fields').empty();
    $('#table_data').empty();

    //Call the post request to post a query to the server.
    //Posts a Describe query to get the fields and it's corresponding types.
    postQuery(`DESCRIBE ${table}`, currentDatabase)
        .done(function (response) {

            //Create a table row.
            var tableHeader = $('<tr>');

            //Loops through each field of the response,
            for (i in response) {
                //Creates a div and appends two spans to it, one with the field name and the other with the type.
                const head = $('<div>').addClass('field_header');
                head.append($('<span>').text(response[i]["Field"]));
                head.append($('<span>').text(response[i]["Type"]));

                //Appends it to the table header row with a animation of fadeIn.
                tableHeader.append($('<th>').append(head).hide().fadeIn(1000));
            }
            $('#table_fields').append(tableHeader);
        }
        )
        .fail(function (error) {
            printErrorOnTerminal(error);
        })

    //Call the post request to post a query to the server.
    //Post a query to the server, selecting everything from the database.
    postQuery(`SELECT * FROM ${table}`, currentDatabase)
        .done(function (response) {
            //Get the element with all the table data.
            var tableData = $('#table_data');

            // Clear existing content in tableData
            tableData.empty();

            for (let i in response) {
                //Creates a new row for each object on the response.
                var rowData = $('<tr>');

                for (let key in response[i]) {
                    //Loops through each field on the object and creates a new <td> for it.
                    let value = response[i][key];
                    rowData.append($('<td>').text(value));
                }
                //Append everything with a fadeIn animation.
                tableData.append(rowData.hide().fadeIn(1000));
            }
        })
        .fail(function (error) {
            printErrorOnTerminal(error);
        });
}
//Function to post a query to the server.
function postQuery(query, database) {
    return $.post('/api/query', { query: query, databaseName: database });
}

//Function to post a create query to the server.
function postCreateQuery(database) {
    return $.post('/api/create', { databaseName: database });
}

//Function to print the error message on the terminal.
function printErrorOnTerminal(error) {

    //Receives the error message and parse it into a JSON object and print the error on the terminal.
    const errorMessage = JSON.parse(error.responseText);
    term.echo('[[;red;]' + errorMessage.error);
}