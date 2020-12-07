var cors = require("cors");
require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
const {MongoClient} = require('mongodb')
var createError = require("http-errors");
var app = express();
app.use(cors());
app.use(bodyParser.json())
const port = process.env.PORT || 3008;

var ObjectID = require('mongodb').ObjectID;

//MongoDB connection URI
const uri = `mongodb+srv://avnvbhatta:${process.env.DB_PASSWORD}@cluster0.zxaaj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

//Mongo collection for our app
let collection;

//Function to connect to MongoDB
async function connectMongo() {
    try{

        const client = await MongoClient.connect(uri, { useUnifiedTopology: true })
        console.log("connected")
        collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION)
    }
    catch(err){
        console.log("error", err)
    }
}

connectMongo();


//Login route for handling login
app.get('/test', async (req, res) => {
    res.status(200).send('success')
})

//Login route for handling login
app.post('/login', async (req, res) => {
    let {email, password} = req.body;
    try{
        const result = await collection.findOne(
        {
            "email": email,
            "password": password
        }, {projection: { "password": false}} ,
        )
       
        res.status(200).json({status: "Done", "data": result})
    }
    catch(err){
        console.log("Error: ", err)
        throw createError(500, "Could not update data")
    }
})

//Signup route for handling signups
app.post('/signup', async (req, res) => {
    let {name, email, password, teamSelect} = req.body;
    try{
        const result = await collection.insertOne(
        {
            "name": name,
            "email": email,
            "password": password,
            "teamSelect": teamSelect
        },
        )
        res.status(200).json({"message": "Successfully created user", "data": result.value})
    }
    catch(err){
        console.log("Error: ", err)
        throw createError(500, "Could not update data")
    }
})

//Signup route for handling signups
app.post('/checkloggedin', async (req, res) => {
    let {id} = req.body;
    try{
        const result = await collection.findOne(
        {
            "_id": ObjectID(id),
        }, {projection: { "_id": true}} ,
        )
        res.status(200).json({status: "Done", "data": result})
    }
    catch(err){
        res.status(400).json({status: "Error", "data": null})
        console.log("Error: ", err)
        throw createError(500, "Could not update data")
    }
})

//Port to listen on for requests
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })

module.exports = app;
