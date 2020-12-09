const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const marioModel = require('./models/marioChar');

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// your code goes here
app.get("/mario",async(req,res)=>{
    res.send(await marioModel.find());
});

app.get("/mario/:id",async(req,res)=>{
    const idToSearch= req.params.id;
    try{
        res.send(await marioModel.findById(idToSearch));
    }catch(err){
        res.status(400).send({message: err.message});
    }
});

const nullOrUndefined = val=> val==null || val==undefined;

app.post("/mario",async(req,res)=>{
    const newMario = req.body;
    if(nullOrUndefined(newMario.name) || nullOrUndefined(newMario.weight)){
        res.status(400).send({message: 'either name or weight is missing'});
    }else{
        const newMarioDocument= new marioModel(newMario);
        await newMarioDocument.save();
        res.status(201).send(newMarioDocument);
    }   
});

app.patch("/mario/:id",async(req,res)=>{
    const idToupdate = req.params.id;
    const newMario = req.body;
    try{
    const data = await marioModel.findById(idToupdate);
    if(nullOrUndefined(newMario.name) || nullOrUndefined(newMario.weight)){
        res.status(400).send({message: 'either name or weight is missing'});
    }else{
        if(!nullOrUndefined(newMario.name)){
            data.name= newMario.name
        }
        if(!nullOrUndefined(newMario.weight)){
            data.weight = newMario.weight
       }
       await data.save();
       res.send(data);
    }  
}catch(err){
    res.status(400).send({message: err.message});
} 
});

app.delete("/mario/:id",async(req,res)=>{
    const idToSearch=req.params.id;
    try{
        await marioModel.deleteOne({_id: idToSearch});
        res.send({message: 'character deleted'});
    }catch(err){
        res.status(400).send({message: err.message});
    }
});

module.exports = app;