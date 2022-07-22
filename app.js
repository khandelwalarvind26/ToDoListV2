const express = require('express');
const BS = require('body-parser');
const date = require(__dirname + "/date.js");
const https = require('https');
const app = express();
app.use(BS.urlencoded({extended : true}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

let tasks = ["Cook Food", "Eat Food", "Wash Utensils"];
let workTasks = [];
app.get('/',function(req,res) {
    let day = date.getDate();
    res.render('list',{title:day,task:tasks});
});

app.get("/work",function(req,res) {
    res.render("list",{title:"Work List",task:workTasks});
});

app.get("/about",function(req,res) {
    res.render("about");
});

app.post("/",function(req,res){
    let task = req.body.newtask;
    console.log(task);
    tasks.push(task);
    res.redirect("/");
});

app.post("/work",function(req,res) {
    let task = req.body.newtask;
    workTasks.push(task);
    res.redirect("/work");
});

app.listen(3000,function() {
    console.log("Server started on port 3000");
});