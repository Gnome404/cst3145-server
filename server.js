const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

app.use(express.json())
app.set('port', 3000)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

let db;
MongoClient.connect('mongodb+srv://Alex:Excelcior%401@beta1.qhmzt.mongodb.net', (err, client) => {
    console.log('getting here')
    if (err) {
        console.log(err)
    } else {
        console.log('no error')
        db = client.db('Webstore')
    }
})

app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages');
})

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection('Products');
    console.log('collection Name:', collectionName);
    return next();
})

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        console.log(results);
        if (e) return next(e)
        res.send(results)
    })
})

//Post
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})

// return with object id 
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e)
        res.send(result)
    })
})

//update an object 
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update({ _id: new ObjectID(req.params.id) }, { $set: req.body }, { safe: true, multi: false },
        (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
        })
})

const port = process.env.PORT || 3000
app.listen(3000);
