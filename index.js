const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
	res.header({ "Access-Control-Allow-Origin": "*" });
	next();
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.PASSWORD}@cluster0.r7w9ywx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {

		const touristSpotCollection = client
			.db("touristSpotDB")
			.collection("touristSpot");

		const countryCollection = client.db("countryDB").collection("country");

		app.get("/", (req, res) => {
			res.send("Hello World!");
		});
		app.get("/country", async (req, res) => {
			try {
				const cursor = countryCollection.find();
				const result = await cursor.toArray();
				res.send(result);
			} catch (error) {
				console.error(
					"Error fetching data from country collection:",
					error
				);
				res.status(500).send(
					"Error fetching data from country collection"
				);
			}
		});
		app.get("/alltouristsspot/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const touristSpot = await touristSpotCollection.findOne(query);
			res.send(touristSpot);
		});
		app.get("/mylist/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const touristSpot = await touristSpotCollection.findOne(query);
			res.send(touristSpot);
		});

		app.get("/alltouristsspot", async (req, res) => {
			const cursor = touristSpotCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});
		app.get("/countrytouristsspot/:countryName", async (req, res) => {
			try {
				const country = req.params.countryName;
				const query = { country_name: country };
				const cursor = touristSpotCollection.find(query)
				const touristSpots = await cursor.toArray();
				res.send(touristSpots);
			} catch (error) {
				console.error(
					"Error fetching data from country collection:",
					error
				);
			}
		});

		app.post("/addtouristsspot", async (req, res) => {
			const newTouristSpot = req.body;
			const result = await touristSpotCollection.insertOne(
				newTouristSpot
			);
			res.send(result);
		});
		app.put("/mylist/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const data = req.body;
			const updatedData = { $set: data };
			const option = { upsert: true };
			const result = await touristSpotCollection.updateOne(
				query,
				updatedData,
				option
			);
			res.send(result);
		});
		app.delete("/mylist/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await touristSpotCollection.deleteOne(query);
			res.send(result);
		});

		app.listen(port, () => {
			console.log(`Example app listening on port ${port}`);
		});

		// Send a ping to confirm a successful connection
		// await client.db("admin").command({ ping: 1 });
		// console.log(
		// 	"Pinged your deployment. You successfully connected to MongoDB!"
		// );
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);
