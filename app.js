var express    = require("express");
    bodyParser = require("body-parser"),
    app        = express(),
    mongoose   = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");

//App configuration
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Mongoose model configuration
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//Restful routes

app.get("/", function(req, res){
   res.redirect("/blogs");
})

//Index route
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
      if(err){
         console.log(err)
      } else{
         res.render("index", {blog: blogs});
      }
   });
});

//New blog route
app.get("/blogs/new", function(req, res){
   res.render("new");
});

app.post("/blogs", function(req, res){
   //create blog
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
      if(err){
         res.render("new");
      } else{
         res.redirect("/blogs");
      }
   });
});

//Show route
app.get("/blogs/:id", function(req, res){

   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
         res.redirect("/");
      } else{
         res.render("show", {blog: foundBlog});
      }
   });
});

app.get("/blogs/:id/edit", function(req, res){

   Blog.findById(req.params.id, function(err, foundBlog){

      if(err){
         res.redirect("/blogs");
      } else{
         res.render("edit", {blog: foundBlog});
      }

   });
});

//Update route
app.put("/blogs/:id", function(req, res){

   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
      if(err){
         res.redirect("/");
      } else{
         res.redirect("/blogs/" + req.params.id);
      }

   });
});

//Destroy route
app.delete("/blogs/:id", function(req, res){

   //Destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
         res.redirect("/blogs");
      } else{
         res.redirect("/blogs");
      }
   });
});

app.listen(3000, function(){
   console.log("Server started!");
});