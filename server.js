// 1. What I have learn right away is that
//  if i have .js file
// then I can easily work with it
//  just by setting "type": "module" 
// in the package.json that's it


import * as http from 'http';
import { client, connection } from './db.js';
import bcrypt from 'bcrypt';

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
        req.on('end', async ()=>{
            try {
                const parse_data = JSON.parse(body);

                //Checking the url path
                if (req.url === '/signup') {
                    //signup logic 
                    const { firstname, surname, dob, gender, email, password } = parse_data;
                    
                    //Hashing the password
                    const salt_rounds = 10;
                    const hashed_password = await bcrypt.hash(password, salt_rounds);

                    // Data insertion
                    const query = `
                    INSERT INTO signup_table (firstname, surname, dob, gender, email, hashed_password)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    `;

                    const values = [firstname, surname, dob, gender, email, hashed_password];

                    // Data insertion query with placeholder 
                    client.query(query, values, (err, res) => {
                        if(err) {
                            console.error('Error executing query', err);
                        } else {
                            console.log('Insert successful');
                        }
                    })

                    res.statusCode = 200;
                    res.end(JSON.stringify({ message: 'Data Received' }));

                } else if (req.url === '/login') {
                    // login logic
                    const { email, password } = parse_data;

                    // finding user in database 
                    const query = `SELECT * FROM signup_table WHERE email = $1`;
                    client.query(query, [email], async (err, dbRes)=> {
                        if (err) {
                            console.error('Error executing query: ', err.message);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'An error occured.' }));
                            return; 
                        }

                        const user = dbRes.rows[0];
                        if(!user) {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'User not found' }));
                            return;
                        }

                        //Now, comparing the password 
                        const is_match = await bcrypt.compare(password, user.hashed_password);

                        if (is_match) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Login Successful' }));
                        } else {
                            res.writeHead(401, { 'Content-Type': 'applicatin/json' });
                            res.end(JSON.stringify({ message: 'Invalid credentials. '}));
                        }
                        
                    });

                    //Send a response message using req.end to the frontend 

                } else {
                    //invalid route 
                    res.writeHead(404, { 'Content-Type': 'applicaton/json' });
                    res.end(JSON.stringify({ message: 'route not found.' }));
                }
            } catch(err) {
                console.error('Failed: ', err.message);
            }
        })
    } else {
        res.writeHead(405, { 'Content-Type': 'applicaton/json' });
        res.end(JSON.stringify({ message: 'method not allowed.' }));
    }
});


setTimeout(()=>{
    const PORT = 3000;
    server.listen(PORT,()=>{
        console.log(`Server is running: http://localhost:${PORT}`);
    });

    server.on('error', (error)=>{
        console.error('Server failed to start: ', error.message);
    })
}, 1000);