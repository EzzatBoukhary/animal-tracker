const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));

const { MongoClient, ObjectId } = require('mongodb');

//const MongoClient = require('mongodb').MongoClient;
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
    /*
        How to test on Postman
        URl: http://localhost:5000/api/login
        Dropdown: POST
        Headers: Content-type application/json
        Raw:{
                "login" : "HarpAA",
                "password" : "password"
            }
    */
    // incoming: login, password
    // outgoing: id, firstName, lastName, error

    const { login, password } = req.body;

    var error = '';
    var id = -1;
    var fn = '';
    var ln = '';

    const results = await db.collection('Users').findOne({ Login: login, Password: password });

    if (results) {
        if (results.isVerified) {
             id = results.UserId;
            fn = results.FirstName;
            ln = results.LastName;
        } else {
            error = 'User account is not verified.';
        }
    }
    else
    {
        error = 'Invalid user name/password';
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
        /*
        How to test on Postman
        URl: http://localhost:5000/api/register
        Dropdown: POST
        Headers: Content-type application/json
        Raw: {
            "login" : "HarpAA",
            "password" : "password",
            "email" : "harper@test.com",
            "firstName" : "Harp",
            "lastName" : "Archambault"
        }
        */
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
    /*
        How to test on Postman
        URl: http://localhost:5000/api/create
        Dropdown: POST
        Headers: Content-type application/json
        Raw: {
            "login" : "HarperA",
            "location" : "Student Union",
            "photo" : "bird.img",
            "description" : "I saw this bird outside the student union",
            "animal" : "Bird"
            }
    */

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

    /*
        How to test on Postman
        URl: http://localhost:5000/api/getPosts
        Dropdown: GET
        Headers: Content-type application/json
    */

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

    /*
        How to test on Postman
        URl: http://localhost:5000/api/searchPosts/?animal=(type in animal here)
        Dropdown: GET
        Headers: Content-type application/json
    */

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

app.delete('/api/deletePost/:postId', async (req, res) => {
    /*
        How to test on Postman
        URl: http://localhost:5000/api/deletePost/(type in _id number here)
        Dropdown: DELETE
        Headers: Content-type application/json
    */

    const { postId } = req.params;

    try {
        const result = await db.collection('Posts').deleteOne({ _id: new ObjectId(postId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

app.get('/api/getUserPosts/:userId', async (req, res) => {
    /*
        How to test on Postman
        URl: http://localhost:5000/api/getUserPosts/(type in userId)
        Dropdown: GET
        Headers: Content-type application/json
    */

    try {
        const { userId } = req.params;
        const posts = await db.collection('Posts').find({ userId: Number(userId) }).toArray();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user posts' });
    }
});

//used on mobile to take stress of pagination off mobile hardware 
app.get('/api/getPostsMobile', async (req, res) => {
    /*
        How to test on Postman
        URl: http://localhost:5000/api/getPostsMobile
        Dropdown: GET
        Params: key: Page value: 1
                key: limit value: 10
        Headers: Content-type application/json
    */
    
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters, with defaults

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
                    username: '$userDetails.Login',
                    location: 1,
                    photo: 1,
                    description: 1,
                    animal: 1,
                    postedDate: 1
                }
            },
            { $sort: { postedDate: -1 } }, // Sort posts by newest first
            { $skip: (page - 1) * parseInt(limit) }, // Skip documents for pagination
            { $limit: parseInt(limit) } // Limit the number of posts per page
        ]).toArray();

        // Get the total number of posts for pagination purposes
        const totalPosts = await db.collection('Posts').countDocuments();

        console.log("Fetched posts:", posts); // Log the posts fetched from the database

        res.status(200).json({
            success: true,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPosts,
            posts,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch posts' });
    }
});

app.listen(5000); // start Node + Express server
