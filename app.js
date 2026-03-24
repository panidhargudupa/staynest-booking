const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErr");

const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");


// DB
mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
.then(()=> console.log("DB Connected"))
.catch(err=> console.log(err));


// VIEW ENGINE
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));


// ROUTERS
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);


// HOME
app.get("/",(req,res)=>{
    res.send("Working");
});


// 404
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});


// ERROR
app.use((err,req,res,next)=>{
    let { statusCode=500 , message="Something Went Wrong"} = err;
    res.status(statusCode).render("listings/error",{ message });
});


app.listen(8080,()=>{
    console.log("Server Running");
});