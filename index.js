require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//^ Middleware
app.use(cors());
app.use(express.json());


//!Configuration of mongodb Database //
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vzdnu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




const run = async () => {
    try {
        await client.connect();

        //? Database collections
        const taskCollection = client.db("todo-app").collection("tasks");

        //~Get all tasks 
        //~http://localhost:5000/get-task
        app.get('/get-task', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })

        //~Post tasks 
        //~http://localhost:5000/post-task
        app.post('/post-task', async (req, res) => {
            const todo = req.body;
            const result = await taskCollection.insertOne(todo);
            if (result.acknowledged) {
                res.send({ success: true, result: result })
            } else {
                res.send({ success: false, message: 'Something went wrong!' })
            }
        })

        //~Update tasks 
        //~http://localhost:5000/update-task
        app.put('/update-task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = { $set: { status: true } };
            const result = await taskCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        //~Delete tasks 
        //~http://localhost:5000/delete-task
        app.delete('/delete-task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is running well')
})

app.listen(port, () => {
    console.log('Doctors Portal server is running on port -', port);
})