const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressErr");
const Listing = require("./models/listing");
const Review = require("./models/reviews");

// Middleware to validate listing data using the listingSchema
module.exports.validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// Middleware to validate review data using the reviewSchema
module.exports.validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// Middleware to check if the user is authenticated before allowing access to certain routes
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){ // If the user is not authenticated, flash an error message and redirect to the login page
        req.session.redirectUrl = req.originalUrl; // Store the original URL the user was trying to access
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

// Middleware to check if the current user is the author of the listing before allowing them to edit or delete it
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) { // If there is a redirect URL stored in the session, make it available in res.locals for use in the login route
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Middleware to check if the current user is the owner of the listing before allowing them to update it
module.exports.isAuthor = async(req,res,next)=> {
        let { id } = req.params;
         let listing = await Listing.findById(req.params.id);
    // Check if the currently logged in user is the owner of the listing before allowing them to update it
        if (!res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id))  { 
            req.flash("error", "You do not have permission to edit or delete this listing!");
            return res.redirect(`/listings/${req.params.id}`); // Redirect back to the listing details page if the user is not the owner of the listing
        }
        next();
}
 

// Middleware to check if the current user is the author of the review before allowing them to delete it
module.exports.isReviewAuth = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
// Check if the currently logged in user is the author of the review before allowing them to delete it
    if (!res.locals.currentUser || !review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author");
        return res.redirect(`/listings/${id}`);
    }
    next();
};