var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
// var user = require("./routes/users");
var index=require("./routes/index");
app.use(bodyParser.urlencoded({extended:true}));

//mongoose.connect("mongodb://localhost/group",{useNewUrlParser:true});
mongoose.connect("mongodb://localhost/fer",{useNewUrlParser:true});
app.use(express.static(__dirname+"/public"));

// app.use(user);
app.use(index);

app.get("/",(req,res)=>
{
    res.render("index.ejs");
    
});


app.listen(3000,"localhost",function(){
    
    console.log("App running , sir");
});