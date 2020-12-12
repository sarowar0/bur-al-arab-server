const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const password = 'vKmyWbgIKUVNBABj';

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oor8w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const bookingsCollection = client.db(`${process.env.DB_NAME}`).collection("bookings");

    app.post("/addUser", (req, res) => {
        const newBooking = req.body;
        bookingsCollection.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })




    var admin = require("firebase-admin");
    var serviceAccount = require("./Config/burj-al-arab-autho-firebase-adminsdk-houo3-01dbf1fa5a.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://burj-al-arab-autho.firebaseio.com"
    });


    app.get('/bookings', (req, res) => {
        const queryEmail = req.query.email;
        const idToken = req.headers.authorization;

        if (idToken) {
            admin.auth().verifyIdToken(idToken)
                .then(decodedToken => {
                    const tokenEmail = decodedToken.email;
                    if (queryEmail && tokenEmail ) {
                        bookingsCollection.find({email: queryEmail})
                        .toArray((err, documents) => {
                            res.send(documents)
                        })
                    }
                })
                .catch((error) => {
                    res.send("Un-Authorized access")
                })
        }
        else{
            res.send("Un-Authorized access")
        }
    })


});

app.listen(4200)