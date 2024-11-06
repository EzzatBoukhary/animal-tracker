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
    
        const { login, password, email, firstName, lastName } = req.body;
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
                    Email: email,
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
    
        var ret = {error:error};
        res.status(error ? 400 : 201).json({ message: error ? error : 'User registered successfully', Id, error });
    }
    );
app.post('/api/create', async (req, res, next) =>
{
    //incoming: userId, location, photo, description, animal

    const { userId, location, photo, description, animal} = req.body;
    const postedDate = new Date();

    var error = '';

    if (!userId || !location || !photo || !description || !animal)
    {
        error = 'Missing required information'
    }

    try
    {
        const user = await db.collection('Users').findOne({ UserId: userId});
        if (!user)
        {
            error = 'User does not exist';
        }

        const result = await db.collection('Posts').insertOne({
            userId,
            location,
            photo,
            description,
            animal,
            postedDate
        })
    }
    catch (e) 
    {
        console.error("Error in /api/create:", e);
        error = 'Internal server error';
    }
    res.status(error ? 400 : 201).json({ message: error ? error : 'Post created successfully', userId, error });

});

app.get('/api/getPosts', async (req, res) => {
    try {
        console.log("Received request to /api/getPosts"); // Log when the endpoint is hit

        const posts = await db.collection('Posts').aggregate([
            // Your aggregation pipeline here
            {
                $lookup: {
                    from: 'Users',
                    localField: 'userId',
                    foreignField: 'UserId',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: false // Remove posts with no matching user
                }
            },
            {
                $project: {
                    username:'$userDetails.Login',
                    location: 1,
                    photo: 1,
                    description: 1,
                    animal: 1,
                    postedDate: 1
                }
            },
            { $sort: { postedDate: -1 } } // Sort posts by newest first
        ]).toArray();

        console.log("Fetched posts:", posts); // Log the posts fetched from the database

        res.status(200).json(posts); // Return JSON response
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' }); // Send error as JSON
    }
});

app.get('/api/searchPosts', async (req, res) => {
    const { animal } = req.query;

    // Log animalType and filter
    console.log("Received animal:", animal);

    // Only include animalType in filter if it's specified
    const filter = animal ? { animal: { $regex: new RegExp(`^${animal}$`, 'i') } } : {};
    console.log("Filter applied:", filter);

    try {
        const posts = await db.collection('Posts').aggregate([
            {
                $match: filter
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'userId',
                    foreignField: 'UserId',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    username: "$userDetails.Login",
                    location: 1,
                    photo: 1,
                    description: 1,
                    animal: 1,
                    postedDate: 1
                }
            },
            { $sort: { postedDate: -1 } }
        ]).toArray();

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({ error: 'Failed to search posts' });
    }
});



app.listen(5000); // start Node + Express server