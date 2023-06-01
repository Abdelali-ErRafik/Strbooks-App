const express = require('express');
const {ensureAuth} = require('../middleware/auth');
const router = express.Router();

const Story = require('../models/story');

// @desc Show add story 
// @route GET /stories/add
router.get('/add',ensureAuth, (req, res) => {
    res.render('stories/add',{
        name: req.user.firstName,
        _id: req.user.id,
    });
});

// @desc Add story
// @route POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try 
    {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } 
    catch (error) 
    {
        console.error(error);
        res.render('error/500',{
            name: req.user.firstName,
            _id: req.user.id,
        });
    }

});

// @desc Show all stories
// @route GET /stories/add
router.get('/',ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({status: 'public'})
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();

        res.render('stories/index', {
            name: req.user.firstName,
            _id: req.user.id,
            stories
        });
    }
    catch(error) {
        console.log(error);
        res.render('error/500',{
            name: req.user.firstName,
            _id: req.user.id,
        });
    }
});


// @desc Show edit story form
// @route GET /stories/edit:id
router.get('/edit/:id',ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean();

        if(!story)
        {
            return res.render('error/404',{
                name: req.user.firstName,
                _id: req.user.id,
            });
        }

        if(story.user != req.user.id)
        {
            return res.render('/stories');
        }else {
            res.render('stories/edit', {
                name: req.user.firstName,
                _id: req.user.id,
                story
            });
        }
    }
    catch(error) {
        console.log(error);
        res.render('error/500',{
            name: req.user.firstName,
            _id: req.user.id,
        });
    }
});

// @desc Update story
// @route PUT /stories/:id
router.put('/:id',ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean();
        if(!story)
        {
            return res.render('error/404',{
                name: req.user.firstName,
                _id: req.user.id,
            });
        }

        if(story.user != req.user.id)
        {
            return res.redirect('/stories');
        
        }else 
        {
            story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            });
            res.redirect('/dashboard');
        }
    } catch (error) {
        console.error(error);
        res.render('error/500',{
            name: req.user.firstName,
            _id: req.user.id,
        });
    }
});



// @desc Delete story
// @route GET /stories/:id
router.delete('/:id',ensureAuth, async (req, res) => {
    try 
    {
        await Story.remove({_id: req.params.id});
        res.redirect('/dashboard');
    }
    catch(error)
    {
        console.log(error);
        res.render('error/500',{
            name: req.user.firstName,
            _id: req.user.id,
        });
    }
});

// @desc Show Single story
// @route GET /stories/:id
router.get('/:id',ensureAuth, async (req, res) => {
    try
    {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean();
        
            if(!story)
            {
                return res.render('error/404',{
                    name: req.user.firstName,
                    _id: req.user.id,
                });
            }

            res.render('stories/show', {
                name: req.user.firstName,
                _id: req.user.id,
                story
            });

    }catch(error) {
        console.log(error);
        res.render('error/500',{
            name: req.user.firstName,
            _id: req.user.id,
        });
    }
});

// @desc User stories
// @route GET /stories/user/:userid
router.get('/user/:userId',ensureAuth, async (req, res) => {
    try 
    {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean();

        res.render('stories/index', {
            name: req.user.firstName,
            _id: req.user.id,
            stories
        });
    }
    catch(error) {
        console.log(error);
        res.render('error/500',{
            name: req.user.firstName,
            _id: req.user.id,
        });
    }
});


module.exports = router;