require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SpotifyWebApi = require('spotify-web-api-node');

app.post('/login', (req,res) => {
    const {code} = req.body;
    const spotify = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });

    spotify.authorizationCodeGrant(code)
    .then(data => {
        console.log(data);
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        });
    })
    .catch(err => {
        res.sendStatus(400);
    })
});

app.post('/refresh', (req,res) => {
    const refreshToken = req.body.refreshToken;
    const spotify = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    });

    spotify.refreshAccessToken()
    .then(data => {
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in
        })
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
})

app.listen(3001);