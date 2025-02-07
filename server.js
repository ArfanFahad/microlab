// 1. What I have learn right away is that
//  if i have .js file
// then I can easily work with it
//  just by setting "type": "module" 
// in the package.json that's it


import * as http from 'http';
import { client, connection } from './db.js';

//Database Connection 
connection();


const server = http.createServer( async (req, res)=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if(req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Handling POST Request 
    if(req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body = body + chunk;
        });
        req.on('end', ()=>{
            try {
                const parse_data = JSON.parse(body);
                const { firstname, surname, dob, gender, email, password } = parse_data;

                const query = `
                    INSERT INTO signup_table (firstname, surname, dob, gender, email, password)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `;

                const values = [firstname, surname, dob, gender, email, password];

                client.query(query, values, (err, res) => {
                    if(err) {
                        console.error('Error executing query', err);
                    } else {
                        console.log('Insert successful');
                    }
                })

            } catch(err) {

            }
        })
    }
});



const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`);
})