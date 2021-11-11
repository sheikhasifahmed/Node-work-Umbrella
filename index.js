const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello...hello.. hello... Everyone to the final Project");
});

app.listen(port, () => {
  console.log("listening to the port", port);
});

const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env._DB_USER}:${process.env._DB_PASS}@cluster0.ig2yp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("umbrella");
    const productsCollection = database.collection("products");

    // fetching the products data into the port
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // Adding a new product to the database
    app.post("/add-product", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(newProduct);
      console.log(newProduct);
    });

    // single product data fetching by id for purchase
    app.get("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await productsCollection.findOne(query);

      res.send(result);
    });

    // app.put("/user/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updatedUser = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: { name: updatedUser.name, email: updatedUser.email },
    //   };
    //   const result = await usersCollection.updateOne(
    //     filter,
    //     updateDoc,
    //     options
    //   );
    //   res.json(result);
    // });

    // deletation of a prouduct
    // app.delete("/product/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await productsCollection.deleteOne(query);
    //   console.log(result);
    //   res.json(result);
    // });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

async function order() {
  try {
    await client.connect();
    const database = client.db("umbrella");
    const ordersCollection = database.collection("orders");
    // create a document to insert

    app.post("/purchase", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(order);
    });

    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.get("/my-orders/:user", async (req, res) => {
      const user = req.params.user;
      console.log(user);
      const query = { userEmail: user };
      console.log(query);
      const cursor = ordersCollection.find(query);
      // console.log(cursor);
      const bookings = await cursor.toArray();
      console.log(bookings);
      res.send(bookings);
    });

    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      console.log(update);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: { status: update.status },
      };
      const result = await ordersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.json(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
order().catch(console.dir);
