// import modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate'); // boilerplate for ejs
const Campground = require('./models/campground');
const methodOverride = require('method-override')

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
// use express
const app = express();
// set path and view engine
app.engine('ejs', ejsMate); // parse/understand ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // use views folder to render
// get req.body
app.use(express.urlencoded({ extended: true }));
// use method override
app.use(methodOverride("_method"));

app.get('/', (req, res) => {
    //res.send("hello from YelpCamp");
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})
// new
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
// new - post request
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

});
// edit 
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
})
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
})
// show page
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})
// delete items
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


app.listen(3000, () => {
    console.log("serving on port 3000...");
})