'use strict';

const express = require('express');
const https = require('https');
const http = require('http');
const app = express();
const fs = require('fs');
const axios = require('axios');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const API_BASE_URI ='https://www.strava.com/api/v3';

var privateKey  = fs.readFileSync('certs/RSA-privkey.pem', 'utf8');
var certificate = fs.readFileSync('certs/RSA-cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

app.get('/', function (req, res) {
  res.send('<html><meta name="viewport" content="width=device-width" /><body><a href="/stravaAuth">Update last run to name "Easy"</a></body></html>');
})

app.get('/stravaAuth', function (req, res) {
    res.redirect(`https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&scope=activity:write,activity:read&redirect_uri=https://pabonet.duckdns.org:4043/oauth_callback`)
})

// https://pabonet.duckdns.org/oauth_callback?state=&code=dad0d4fb11f43c34c9366d1605a695b9ad90de1a&scope=read,activity:write
app.get('/oauth_callback', function (req, res) {
    console.log(req.query);

    axios.post('https://www.strava.com/oauth/token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: req.query.code,
        grant_type: 'authorization_code'
    }).then(tokenResponse => {
        // tokenResponse.data.refresh_token
        // tokenResponse.data.access_token
        // Authorization: Bearer #{access_token} 

        const accessToken = tokenResponse.data.access_token;
        const last6hours = (Date.now() - (6 * 1000 * 60 * 60))/1000;
        axios.request({
            method: 'get',
            url: `${API_BASE_URI}/athlete/activities?after=${last6hours}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(activitiesResponse => {
            // got activities response back
            // console.log(activitiesResponse)
            const activity = activitiesResponse.data[0];
            console.log(activity.id);
            console.log(activity.name);

            axios.request({
                method: 'put',
                url: `${API_BASE_URI}/activities/${activity.id}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                data: {
                    name: 'Easy'
                }
            }).then(updateResponse => {
                console.log("success", updateResponse)
                res.send('YEZ');
            }).catch(error => {
                console.log("update failed", error)
                res.send(JSON.stringify(error));
            })

        }).catch(error => {
            console.log("something went wrong", error)
            res.send(JSON.stringify(error));
        });
    }).catch(error => {
        console.log(`ERROR in token POST: ${error}`);
        res.send(JSON.stringify(error));
    })
});

// POST https://www.strava.com/oauth/token with its client ID and
//  client secret to exchange the authorization code for a refresh token and short-lived access token.






http.createServer(app).listen(4040)
https.createServer(credentials, app).listen(4043)