const { MongoClient, ServerApiVersion, BSON } = require("mongodb");
const {create} = require("axios");

const client = new MongoClient("mongodb+srv://ishwarjagdale:ishwar01Ishwar@cluster0.l8maiqw.mongodb.net/?retryWrites=true&w=majority", {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	},
	rejectUnauthorized: false,
});

async function run() {
	await client.connect();
	await client.db("Cluster0").command({ ping: 1 });
	const collections = await client.db("Cluster0").listCollections().toArray();
	if(!collections.filter(c => c.name === "users").length) {
		const res = await client.db("Cluster0").createCollection("users");
		console.log(res);
	}
}

async function getUser(value, field="emailAddress") {
	const db = client.db("Cluster0");
	if(field === "_id") {
		return await db.collection("users").findOne({_id: new BSON.ObjectId(value)});
	}
	const query = {};
	query[field] = value;
	return await db.collection("users").findOne(query);
}


async function createUser(payload){
	const db = client.db("Cluster0");
	return await db.collection("users").insertOne(payload);
}


async function activateUser(userId) {
	const db = client.db("Cluster0");
	return await db.collection("users").updateOne({_id: new BSON.ObjectId(userId)}, {$set: {authenticated: true}});
}

run().then(null);

module.exports = {
	getUser: getUser,
	createUser: createUser,
	activateUser: activateUser
};