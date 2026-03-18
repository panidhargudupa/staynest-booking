const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
   image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_1280.jpg",
        set: (v) => v === "" ? "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_1280.jpg" : v.url || v,
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;