(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
var User=require("../models/user");
var Video=require("../models/videos");
var api_key="your youtube api key"
var {google}=require("googleapis");
var service=google.youtube('v3');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const alert=require("alert-node")
router.use(bodyParser.urlencoded({extended:true}));
var d;
// Middleware
router.use(bodyParser.json());

// var group =require("../models/group");
// var NodeGeocoder = require('node-geocoder');
// var nodemailer = require("nodemailer");
// var multer = require('multer');
var eid;
var uname;
router.post("/login",function(req,res)
{
    //res.send(req.body);
    var data={"name":req.body.name,"email_id":req.body.email_id};
    User.findOne({email_id:req.body.email_id},function(err,user)
    {
        if(err)
        {
          return  res.redirect("/");
        }
        else
        {
            
        if(!user)
        {
            console.log("new ");
            User.create(data,function(err,user)
                {
                    if(err)
                    {
                        console.log(err);
                        return res.redirect("/");
                        
                    }else
                    {
                       
                    
            var spawn=require("child_process").spawn;
             var process = spawn('C:\\Users\\shivu\\Downloads\\python notes\\python.exe',["./routes/videos.py"]);
             //var decoder=new StringDecoder('utf8');
             process.stdout.on('data',function(data)
             {
                
                    
                    try{
                       d=JSON.parse(data.toString("utf8"));
                        eid=req.body.email_id;
                        uname=req.body.name;
                        res.render("dashboard.ejs",{name:req.body.name,videos:d,uid:req.body.email_id});
                    }
                    catch (error) {
                        // Even though the response status was 2xx, this is still an error.
                        ok = false;
                        // The parse error contains the text of the body that failed to parse.
                        body = ({ error: error});
                        console.log(body);
                    }
            
                 
             });
                                   
                    }
                           
                });
            
        }else
        {      
             var spawn=require("child_process").spawn;
             var process = spawn('C:\\Users\\shivu\\Downloads\\python notes\\python.exe',["./routes/videos.py"]);
             //var decoder=new StringDecoder('utf8');
             process.stdout.on('data',function(data,next)
             {
                 try{
                       d=JSON.parse(data.toString("utf8"));
                        res.render("dashboard.ejs",{name:req.body.name,videos:d,uid:req.body.email_id});
                    }
                    catch (error) {
                        // Even though the response status was 2xx, this is still an error.
                        ok = false;
                        // The parse error contains the text of the body that failed to parse.
                        body = ({ error: error });
                        console.log(body);
                    }
           
             });
             
        }
        }
        
    });
    
});

router.post("/search/:uid/:name",(req,res)=>
{
        var spawn=require("child_process").spawn;
        var process=spawn('C:\\Users\\shivu\\Downloads\\python notes\\python.exe',["./routes/search.py",req.body.search]);
        process.stdout.on("data",function(data,next)
        {
            try{

                d=JSON.parse(data.toString());

                res.render("dashboard.ejs",{videos:d,uid:req.params.uid,name:req.params.name});
            }
            catch(error)
            {

                    var body=({error:error});
                    console.log(body);
                        // The parse error contains the text of the body that failed to parse.
                    
                       

            }

        });
});



router.get("/recommendations/:uid",(req,res)=>
  {
  // User.findOne({"email_id":req.params.uid},function(err,user)
  // {
  // res.send(user);  
  // });
  var spawn=require("child_process").spawn;
  
  var process = spawn('C:\\Users\\shivu\\Downloads\\python notes\\python.exe',["./routes/sample.py",req.params.uid]);
   process.stdout.on('data',function(data,next)
   {
     
     try
     {

      d=JSON.parse( data.toString());
      console.log(d);
       res.render("recommend.ejs",{videos:d,uid:req.params.uid});

     }catch (error) {
                        // Even though the response status was 2xx, this is still an error.
                        ok = false;
                        // The parse error contains the text of the body that failed to parse.
                        body = ({ error: error});
                        console.log(body);
                    }
     
   });
             //var decoder=new StringDecoder('utf8');
});


router.get("/watch/:uid/:vid/:cid",(req,res)=>
{
    var data={videoId:req.params.vid,channelId:req.params.cid};
    Video.create(data,function(err,video)
    {
        if(err)
        {
            console.log(err);
        }else
        {
          
            User.findOne({"email_id":req.params.uid},function(err,user)
            {
                if(err)
                {
                    console.log(err);
                    return;
                }
                else
                {
                      var spawn=require("child_process").spawn;
                      var process = spawn('C:\\Users\\shivu\\Downloads\\python notes\\python.exe',["./routes/detectfaces.py",video._id,user.email_id,]);
                      res.render("watch.ejs",{vid:req.params.vid,uid:req.params.uid});
                      

                      process.stdout.on('data',function(data)
             {
              console.log("o=",data.toString());
                
                  // d=JSON.parse(data.toString("utf8"));
                 
                 // console.log(typeof(d));
                
                 if(data.toString().localeCompare("[ INFO:0] Initialize OpenCL runtime..."))
                 {

                  alert("Image processing finished"); 
                  
                 }

                
           
                 
             });
            
                      
                }
                
            })
        }
        
    });
    
});

// router.get("/capture",(req,res)=>
// {
//              var spawn=require("child_process").spawn;
//              var process = spawn('C:\\Users\\shivu\\Downloads\\python notes\\python.exe',["./routes/detectfaces.py"]);
            
    
// });


module.exports = router;