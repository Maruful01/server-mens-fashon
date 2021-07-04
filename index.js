const express = require ('express');
const bodyParser = require('body-parser')
const cors = require ('cors');
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');
require('dotenv').config()

const app = express ()
app.use(bodyParser.json());
app.use (cors());
app.use (express.static('products'));
app.use (fileUpload());
const port = 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8dpf0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const productCollection = client.db("redux").collection("products");
  const userCollection = client.db("redux").collection("users");
  // perform actions on the collection object
  console.log ("database connected")

  app.get('/', function (req, res) {
    res.send('hello world')
  })

  app.get ('/products', (req, res) => {
    productCollection.find ({})
    .toArray ((err, documents) => {
      res.send (documents);
    })
  })

  app.get ('/product', (req, res) => {
    // console.log (req.query.id)
    productCollection.find ({id: req.query.id})
    .toArray ((err, documents) => {
      res.send (documents);
    })
  })

  app.post ('/addUser', (req, res) => {

    const order = req.body;
    userCollection.insertOne (order)
    .then (result => {
        res.send (result.insertedCount > 0)
    })
   })

app.get ('/users',  ( req, res ) => {
   console.log (req.query.email);
   userCollection.find ({ email: req.query.email })
   .toArray (( err, documents ) => {
       res.send (documents);
   })

});

app.listen (process.env.PORT || port)