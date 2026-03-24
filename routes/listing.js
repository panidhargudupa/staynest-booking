const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const wrapAsync = require("../utils/WrapAsync");
const { validateListing } = require("../middleware");

// INDEX
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{ allListings });
}));

// NEW
router.get("/new",(req,res)=>{
    res.render("listings/new");
});

// SHOW
router.get("/:id", wrapAsync(async(req,res)=>{
    const listing = await Listing.findById(req.params.id).populate("reviews");
    res.render("listings/show",{ listing });
}));

// EDIT
router.get("/:id/edit", wrapAsync(async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit",{ listing });
}));

// CREATE
router.post("/", validateListing ,wrapAsync(async(req,res)=>{
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");
}));

// UPDATE
router.put("/:id", validateListing ,wrapAsync(async(req,res)=>{
    await Listing.findByIdAndUpdate(req.params.id,{...req.body.Listing});
    res.redirect(`/listings/${req.params.id}`);
}));

// DELETE
router.delete("/:id", wrapAsync(async(req,res)=>{
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
}));

module.exports = router;