const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors());
//To do json of client response
app.use(express.json());




const uri = "mongodb+srv://haiman:0Frg8OWt25ZMY2pc@cluster0.yxikeow.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try {
        const jerseyCollection = client.db("jersey-shop").collection("jersey")

        const mostSale = client.db("jersey-shop").collection("mostsale")

        ////Read/To Show all data from database 
        app.get('/jersey', async (req, res) => {
            const query = {};
            const cursor = jerseyCollection.find(query);
            const jersey = await cursor.toArray();
            res.send(jersey);
        })

        app.get('/mostsale', async (req, res) => {
            const query = {};
            const cursor = mostSale.find(query);
            const mosts = await cursor.toArray();
            res.send(mosts);
        })


        //Create Service
        app.post('/jersey', async (req, res) => {
            const jersey = req.body;
            const result = await jerseyCollection.insertOne(jersey)
            res.send(result);
        })



        app.delete('/jersey/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await jerseyCollection.deleteOne(query)
            res.send(result);
        })


        //Filtering desired data for Update Operation
        app.get('/jersey/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const jersey = await jerseyCollection.findOne(query)
            res.send(jersey);
        })

        app.put('/jersey/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const jersey = req.body;
            console.log(jersey);
            const updatedUser = {
                $set: {
                    title: jersey.title,
                    imageLink: jersey.imageLink,
                    price: jersey.price
                }
            }

            const result = await jerseyCollection.updateOne(filter, updatedUser, option);
            res.send(result)
        })

    }

    finally {

    }
}



run().catch(err => console.log(err))




app.get('/', (req, res) => {
    res.send('Jersey Mania Shop');
});

app.listen(port, () => {
    console.log('Running Successfully');
})