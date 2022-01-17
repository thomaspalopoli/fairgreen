//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/vegetableDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const vegetableSchema = {
  vegetable: String,
  availability: String
};

const Vegetable = mongoose.model("vegetable", vegetableSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/vegetables", function(req, res){
  Vegetable.find({}, function(err, vegetables){
  res.render("vegetables", {
    vegetables: vegetables});
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  
  const vegetable = new Vegetable({
    vegetable: req.body.vegetableName,
    availability: req.body.vegetableAvailability
  });

  vegetable.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });

});

app.get("/vegetables/:vegetableId", function(req, res){
  
  const requestedVegetableId = req.params.vegetableId;

  Vegetable.findOne({_id:requestedVegetableId}, function(err, vegetable){
    if (!err) {
      res.render("vegetable", {
        vegetable: vegetable.vegetable,
        availability: vegetable.availability
      });
    }
  });

});

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("Server started on port 3000");
});

/* app.listen(3000, function() {
  console.log("Server started on port 3000");
}); */
