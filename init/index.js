const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

const mongo_url = "mongodb://127.0.0.1:27017/airbnb";

async function main() {
    await mongoose.connect(mongo_url)
}

main()
    .then(() => {
        console.log("connected to db")
    })
    .catch((err) => {
        console.log(err)
    });

const initDB = async () => {
    await Listing.deleteMany({});
    // Assigning a default owner ID to each listing in the initData before inserting them into the database. This is necessary because the Listing model has a required owner field that references a User, and we need to ensure that each listing has a valid owner ID when we initialize the database with sample data.
    initData.data = initData.data.map((obj) => ({...obj,owner: new mongoose.Types.ObjectId("69ca448501d3208430eb85cc")}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
