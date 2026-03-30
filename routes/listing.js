const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const wrapAsync = require("../utils/WrapAsync");
const { validateListing, isAuthor } = require("../middleware");
const { isLoggedIn } = require("../middleware"); // Importing the isLoggedIn middleware to protect certain routes

// INDEX
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{ allListings });
}));

// NEW
router.get("/new",isLoggedIn, (req,res)=>{ // Only logged in users can access the form to create a new listing
    res.render("listings/new");
});

// SHOW
router.get("/:id", wrapAsync(async(req,res)=>{
    const listing = await Listing.findById(req.params.id)
    // Populate the reviews and owner fields to display the associated data in the listing details page
        .populate({path: "reviews",populate: { path: "author" } }) // Populate the reviews and their authors(nested population )
        .populate("owner"); 
    if(!listing) {
          req.flash("error", "Listing not found!");
          return res.redirect("/listings");
          
    }
    res.render("listings/show",{ listing });
}));

// EDIT
router.get("/:id/edit",isLoggedIn,isAuthor, wrapAsync(async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit",{ listing });
}));

// CREATE
router.post("/", isLoggedIn,isAuthor, validateListing ,wrapAsync(async(req,res)=>{ // Only logged in users can create a new listing, and the listing data is validated using the validateListing middleware
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner of the listing to the currently logged in user
    await newListing.save();
    if(!newListing) {
          req.flash("error", "Failed to create listing!");  
          res.redirect("/listings/new");
    }     
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
}));

// UPDATE
router.put("/:id", isLoggedIn,isAuthor,validateListing ,wrapAsync(async(req,res)=>{
    await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
     req.flash("success", "Updated successfully!");
    res.redirect(`/listings/${req.params.id}`);
}));

// DELETE
router.delete("/:id",isLoggedIn,isAuthor, wrapAsync(async(req,res)=>{
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;