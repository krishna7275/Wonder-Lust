const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const WrapAsync = require("./utils/WrapAsync.js");  
const ExpressError = require("./utils/ExpressError.js");
const joi = require("joi");
const { listingSchema } = require("./utils/schema.js");
 

const MONGO_URL ="mongodb://127.0.0.1:27017/womderLust";

main().then(() => {
    console.log("connection to Db");
} )
.catch((err) => 
{
    console.log(err);
})


async function main() {
    await mongoose.connect(MONGO_URL);
}

// app.get("/testListing", async (req,res) => {
//    let sampleListing = new Listing({
//     title : "My New Villa",
//     description : "By the beach",
//     price : 1200,
//     location : "calanguate, Goa",
//     country : "India"
//    });

//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");
// });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//root route
app.get("/",(req,res) => {
    res.send("Hi i am root");
});

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let ersMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, ersMsg);
    }else{
        next();
    }
}

//index route
app.get("/listings", async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//Add route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async(req,res) => {
    let {id} = req.params
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//create route
app.post("/listings", WrapAsync(async (req,res) => {
     const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
   
    
}));

//edit route
app.get("/listings/:id/edit", WrapAsync(async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
}));

//update Route
app.put("/listings/:id", WrapAsync(async (req,res) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"Send valid data for listings");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delte Route
app.delete("/listings/:id", WrapAsync(async (req,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// catch-all for unknown routes
app.use((req, res, next) => {
    next(new ExpressError(404, "page not found !"));
});

// centralized error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    // res.status(statusCode).send(message);
    res.render("Error.ejs",{message})
});

app.listen(8080, () => {
console.log("Server is listing at 8080");
}); 
