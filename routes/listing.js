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
    if(!listing) {
          req.flash("error", "Listing not found!");
          res.redirect("/listings");
          
    }
    res.render("listings/show",{ listing });
}));

// EDIT
router.get("/:id/edit", wrapAsync(async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit",{ listing });
}));

// CREATE
router.post("/", validateListing ,wrapAsync(async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    if(!newListing) {
          req.flash("error", "Failed to create listing!");  
          res.redirect("/listings/new");
    }     
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
}));

// UPDATE
router.put("/:id", validateListing ,wrapAsync(async(req,res)=>{
    await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
     req.flash("success", "Updated successfully!");
     
    res.redirect(`/listings/${req.params.id}`);
}));

// DELETE
router.delete("/:id", wrapAsync(async(req,res)=>{
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;