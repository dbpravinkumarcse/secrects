require("dotenv").config();
const express= require("express");
const ejs= require("ejs");
const bodyparser = require("body-parser");
const mongoose=require("mongoose");
const encrypt = require("mongoose-encryption");

const app=express();
console.log(process.env.KEYS);

mongoose.connect("mongodb://localhost:27017/secretsDB",{useNewUrlParser : true});

app.use(bodyparser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/",function(req,res){
  res.render("home");
});

const userSchema=new mongoose.Schema({
  email : String,
  password : String
});

userSchema.plugin(encrypt,{secret :process.env.SECRET, encryptedFields : ["password"]});

const userModel = new mongoose.model("User",userSchema);

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});


app.post("/register",function(req,res){
  const user1=new userModel({
    email : req.body.username,
    password: req.body.password
  });
  user1.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      res.send(err);
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  userModel.findOne({email : username},function(err,founded){
    if(err){
      console.log(err);
    }else{
      if(founded)
      {
      if(founded.password === password){
        res.render("secrets");
      }
    }
  }
  });
});

app.listen(3000, function(){
  console.log("port is started ");
});
