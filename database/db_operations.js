import connection from "./db_connect.js";

class DatabaseOperations {
    async runQuery(query) {
        try {
            const [result, fields] = await connection.execute(query);
            return result;
        } catch (err) {
            console.error('Error executing query:', err.message);
            throw err; // Rethrow the error to handle it in the calling code
        }
    }
}

export default DatabaseOperations;
