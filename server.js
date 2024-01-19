import fs from 'fs';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import DatabaseOperations from './database/db_operations.js';
const app = express();

//Sets the APP to serve the public directory.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

//Sends the app html file when entering the site.
app.get('/', (req, res) => {
    res.sendFile('./public/app.html');
});

app.post('/api/query', async (req, res) => {
    try {
        const query = req.body.query;
        const DB = new DatabaseOperations();
        const result = await DB.runQuery(query);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
    }
}
);

app.listen(5500);