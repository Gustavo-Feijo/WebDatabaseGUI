import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import databaseOperations from './database/db_operations.js';

const app = express();

//Sets the current dirname to be used in modules.
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Sets the app to serve the public directory and use middleware to parse the requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

// Sends the app HTML file when entering the site.
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'public', 'app.html');
    const decodedPath = decodeURI(htmlPath);
    res.sendFile(decodedPath);
});

//Receives a post request with a custom query.
app.post('/api/query', async (req, res) => {
    try {
        //Get the query string from the request and checks if it's not empty
        //Get the database name if one was specified.
        const query = req.body.query;
        const databaseName = req.body.databaseName || null;

        if (!query) {
            return res.status(400).json({ error: 'Missing or empty query parameter' });
        }

        //Creates a instance of the DB operations and calls the runQuery method.
        const DB = new databaseOperations();
        const result = await DB.runQuery(query, databaseName);
        //Send the result to the client.
        res.status(200).json(result);

    } catch (error) {
        //If a error occurred on the process, send back the error message to the client.
        console.log('Error executing query:', error);
        res.status(400).json({ error: error });
    }
});

//Receives a post request with a custom DB Name.
app.post('/api/create', async (req, res) => {
    try {
        //Get the db name from the request and checks if it's not empty.
        const db_name = req.body.databaseName;

        if (!db_name) {
            return res.status(400).json({ error: 'Missing or empty name parameter' });
        }

        //Creates a instance of the DB operations and call the createDatabase.
        const DB = new databaseOperations();
        const result = await DB.createDatabase(db_name);

        res.status(200).json(result);

    } catch (error) {
        console.log('Error creating DB:', error);
        res.status(400).json({ error: error });
    }
});

//Let the server listen on port 5500.
app.listen(5500, () => {
    console.log('Server is running on http://localhost:5500');
});
