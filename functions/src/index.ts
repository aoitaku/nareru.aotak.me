import * as functions from 'firebase-functions'

const tweets = []

export const fetchTweets = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*')
  response.set('Access-Control-Allow-Methods', 'GET')
  response.status(200).send(tweets[Math.floor(Math.random() * tweets.length)])
})
