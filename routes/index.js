const express = require('express');
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const Story = require('../models/story');
const router = express.Router();

// @desc Login/Landing Page
// @route GET /
router.get('/',ensureGuest, (req, res) => {
    res.render('login',{
        layout: 'login'
    });
});

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try 
    {
        const stories = await Story.find({user: req.user.id}).lean();
        res.render('dashboard',{
            name: req.user.firstName,
            _id: req.user.id,
            stories
        });
    }   
    catch (err) 
    {
        console.error(err);
        res.render('error/500');
    }

});

module.exports = router;