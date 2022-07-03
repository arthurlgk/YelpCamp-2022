// import modules
const res = require('express/lib/response');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { descriptors, places } = require("./seedHelpers");
const cities = require("./cities");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});
// check database connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({}); // delete everything
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/random?wood,jungle',
            price,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, nemo autem! Molestiae recusandae vel sunt id, itaque, harum nam iusto inventore soluta minus officiis, deserunt doloribus laboriosam eaque beatae quidem?"
        })
        await camp.save();
    }
}

seedDB().then(() => {
    db.close();
});