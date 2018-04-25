"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const tweets = [];
exports.fetchTweets = functions.https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET');
    response.status(200).send(tweets[Math.floor(Math.random() * tweets.length)]);
});
//# sourceMappingURL=index.js.map