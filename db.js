
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'microlab_db',
    password: 'root',
    port: 8080
});


export async function connection () {
    try {
        console.log('Trying to connect...');
        await client.connect();
        console.log('Database connected successfully');
    } catch(error) {
        console.error('Failed to connect:', error.message);
    }
}

export { client };