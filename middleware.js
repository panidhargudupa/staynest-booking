const listingSchema = require("./schema");
const reviewSchema = require("./schema");
const ExpressError = require("./utils/ExpressErr");

module.exports.validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};