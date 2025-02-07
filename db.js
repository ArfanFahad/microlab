
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'microlab_db',
    password: 'root',
    port: 8080
});


async function connection () {
    try {
        await client.connect();
        console.log('Database connected successfully');
    } catch(error) {
        console.error('Failed to connect:', error.message);
    }
}



connection();