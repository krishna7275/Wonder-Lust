const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");


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

//root route
app.get("/",(req,res) => {
    res.send("Hi i am root");
});

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
app.post("/listings",async (req,res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

app.listen(8080, () => {
console.log("Server is listing at 8080");
});
