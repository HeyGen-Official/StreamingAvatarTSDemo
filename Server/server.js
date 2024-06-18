require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

const API_KEY = process.env.API_KEY; // Read the API key from environment variables

app.use(cors()); // Enable CORS

app.post('/get-access-token', async (req, res) => {
    try {
        //Ask the server for a secure Access Token
        const response = await axios.post('https://api.heygen.com/v1/streaming.create_token', {}, {
            headers: {
                'x-api-key': API_KEY
            }
        });
        res.json({token: response.data.data.token}); // Return the token in the expected structure
    } catch (error) {
        console.error('Error retrieving access token:', error);
        res.status(500).json({ error: 'Failed to retrieve access token' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
