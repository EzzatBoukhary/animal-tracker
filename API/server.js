const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://theBeast:oLqLhnTj8I1gSbV0@cop4331.nhu8j.mongodb.net/?retryWrites=true&w=majority&appName=COP4331';

const client = new MongoClient(url);
client.connect();

const db = client.db('COP4331');

app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});
app.post('/api/login', async (req, res, next) =>
{
    // incoming: login, password
    // outgoing: id, firstName, lastName, error

    const { login, password } = req.body;

    var error = '';
    var id = -1;
    var fn = '';
    var ln = '';

    const results = await db.collection('Users').findOne({ Login: login, Password: password });

    if (results) {
        id = results.UserId;
        fn = results.FirstName;
        ln = results.LastName;
    }
    else
    {
        error = 'Invalid user name/password';
    }

    var ret = { id:id, firstName:fn, lastName:ln, error:error};
    res.status(200).json(ret);
});

async function getNextUserId() 
{
    const lastUser = await db.collection('Users')
      .findOne({}, { sort: { UserId: -1 } });
    return (lastUser?.UserId || 0) + 1;
}

app.post('/api/register', async (req, res, next) =>
{
    // incoming: login, password, first name, last name
    // outgoing: id, firstName, lastName, error

    const { login, password, firstName, lastName } = req.body;
    var error = '';
    var userId = -1;
    var Id = -1
    
    try
    {
        const existingUser = await db.collection('Users').findOne({ Login: login });
        if (existingUser) 
        {
            error = 'Username already taken';
        } 
        else 
        {
            userId = await getNextUserId();
            const result = await db.collection('Users').insertOne({
                Login: login,
                Password: password,
                FirstName: firstName,
                LastName: lastName,
                UserId: userId
            });
            Id = result.insertedId;
        }
    }
    catch (e) {
        console.error("Error in /api/register:", e);
        error = 'Internal server error';
    }

    res.status(error ? 400 : 201).json({ message: error ? error : 'User registered successfully', Id, error });
}
);

app.listen(5000); // start Node + Express server