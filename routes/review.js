const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/reviews");
const wrapAsync = require("../utils/WrapAsync");
const { validateReview, isLoggedIn,  isReviewAuth } = require("../middleware");



// CREATE REVIEW
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id);

        const newReview = new Review(req.body.review);

        newReview.author = req.user._id;

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New review created successfully!");

        res.redirect(`/listings/${listing._id}`);
    })
);


// DELETE REVIEW
router.delete("/:reviewId",isLoggedIn,isReviewAuth, wrapAsync(async (req, res) => { // Only logged in users who are the authors of the review can delete it

    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

     req.flash("success", "deleted review successfully!");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;