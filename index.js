const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Your Next.js app port
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const db = client.db("wanderlast");
        const destinationsCollection = db.collection("destinations");

        // POST endpoint
        app.post('/destinations', async (req, res) => {
            try {
                const destination = req.body;
                const result = await destinationsCollection.insertOne(destination);
                res.status(201).json(result);
            } catch (error) {
                console.error('Error inserting destination:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // GET all destinations endpoint (optional - for testing)
        app.get('/destinations', async (req, res) => {
            try {
                const destinations = await destinationsCollection.find().toArray();
                res.json(destinations);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
        
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Backend!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});