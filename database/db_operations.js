import createConnection from "./db_connect.js";

//Class with the methods to run queries on the database.
class databaseOperations {

    //Most simple method, receive a query string and a optional database name.
    async runQuery(query, databaseName = null) {

        try {
            //Creates the connection. If there is a database selected on the front, runs the query on there.
            const connection = await createConnection(databaseName);

            //Executes the query on the connection.
            const [result, fields] = await connection.execute(query);

            //Returns the result of the query to the server.
            return result;

        } catch (err) {
            //If there is any error, throws it to the server call.
            throw err.message;
        }
    }

    //Method that creates a new database with the specified name.
    async createDatabase(databaseName) {
        try {
            //Creates a new connection without a specified database and creates one if it doesn't exist.
            const connection = await createConnection();
            console.log(databaseName);
            const [result, fields] = await connection.execute(`CREATE DATABASE ${databaseName}`);
            connection.end();

            return result;
        } catch (err) {
            throw err.message;
        }
    }

    //Most simple method, receive a query string and a optional database name.
    async getFields(table, databaseName = null) {

        try {
            //Creates the connection. If there is a database selected on the front, runs the query on there.
            const connection = await createConnection(databaseName);

            //Executes the query on the connection.
            const [rows, fields] = await connection.execute('DESCRIBE ' + table);
            const columnTypes = {};

            rows.forEach(row => {
                columnTypes[row.Field] = row.Type;
            });
            connection.end();

            return columnTypes;

        } catch (err) {
            //If there is any error, throws it to the server call.
            throw err.message;
        }
    }
}

export default databaseOperations;
