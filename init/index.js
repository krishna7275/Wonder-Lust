const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/womderLust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // Normalize data so `image` is a string URL (ignore filename objects)
  const normalized = initData.data.map((item) => {
    const copy = { ...item };
    if (copy.image && typeof copy.image === "object") {
      // prefer url when available, otherwise empty string
      copy.image = copy.image.url || "";
    }
    return copy;
  });

  await Listing.insertMany(normalized);
  console.log("data was initialized");
};

initDB();