const express = require('express');
const BS = require('body-parser');
const date = require(__dirname + "/date.js");
const https = require('https');
const app = express();
const mongoose = require('mongoose');
app.use(BS.urlencoded({extended : true}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/"+"todolistDB");
const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
});

const Task = mongoose.model('Task',taskSchema); 

function buildDB(curr) {
    const item1 = new curr({
        name:"Welcome To your ToDo List!"
    });

    const item2 = new curr({
        name:"Hit the + button to add new tasks."
    });

    const item3 = new curr({
        name:"<-- Hit this checkbox to delete a task."
    });
    const itemList = [item1,item2,item3];
    curr.insertMany(itemList,function(err) {
        if(err) console.log(err);
        else console.log("Success");
    });
    return itemList;
}


app.get('/',function(req,res) {
    let day = date.getDate();
    Task.find({},function(err,task){
        if(err) console.log(err);
        else {
            if(task.length == 0) task = buildDB(Task);
        }
        res.render('list',{title:day,task:task});
    });
    // console.log(tasks);
});

app.get("/about",function(req,res) {
    res.render("about");
});

app.post("/",function(req,res){
    let task = req.body.newtask;
    // console.log(task);
    const item = new Task({
        name:task
    });
    item.save();
    res.redirect("/");
});

app.post("/delete",function(req,res) {
    const id = req.body.checked;
    // console.log(req.url);
    Task.deleteOne({_id:id},function(err) {
        if(err) console.log(err);
        else console.log("Deleted");
    });
    // console.log(req.body.h1);
    res.redirect("/");
});



app.listen(3000,function() {
    console.log("Server started on port 3000");
});