const express = require('express')
const router = express.Router()
const MenuItem = require('../models/MenuItems');


router.post('/', async(req, res)=>{

    try {
        
        const data = req.body
        const newMenu = new MenuItem(data);
        const response = await newMenu.save();
        res.status(201).json({message:  "Menu Item Added", response});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal  Server Error'});

    }

});

router.get('/', async(req, res)=>{
    try {
        
        const data = await MenuItem.find();
        console.log("Data Fetched");
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal  Server Error"});

    }
});

router.get('/:taste', async(req,res)=>{

    try {
        
        const taste = req.params.taste;
        if(['sweet', 'spicy', 'sour'].includes(taste)){
            const response = await MenuItem.find({taste:taste});
            console.log('Menu items fetched: ',taste);
            res.status(200).json(response);
        }else{
            res.status(400).json({error: 'Invalid taste'});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal  Server Error"});
    }

});

module.exports = router;