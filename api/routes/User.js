const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users list endpoint
router.post('/all', function (req, res, next) {
    User.find().sort({fullname: 1})
    .skip(parseInt(req.body.skip))
    .limit(parseInt(req.body.limit))
    .populate('groups')
    .exec(function (err, users) {
        if(err){
            return res.status(500).json({
                code: 500,
                error: err
            })
        }else{
            res.status(200).json({
                code: 200,
                message: "success",
                data: users
            })
        }
    });
});

// Get user by id endpoint
router.post('/byid/:id', function(req, res, next){
    User.findById(req.params.id)
    .exec(function(err, user) {
        if(err){
            return res.status(500).json({
                code: 500,
                error: err
            })
        }else if (!user) {
            return res.status(404).json({
                code: 404,
                error: 'User not found'
            });
        }else{
            res.status(200).json({
                code: 200,
                data: user
            })
        }
    });
});

// Get users by group id endpoint
router.post('/bygroup/:groupid', function(req, res, next){
    User.find({"groups": {_id: req.params.groupid}})
    .populate('groups')
    .exec(function(err, users) {
        if(err){
            return res.status(500).json({
                code: 500,
                error: err
            })
        }else{
            res.status(200).json({
                code: 200,
                data: users
            })
        }
    });
});

//search user endpoint
router.post('/search/:term', function (req, res, next) {
    let query;
    if(req.body.groupid){
        query = {$or: [{fullname : { "$regex": req.params.term.trim(), "$options": "i" }}], group: req.body.groupid};
    }else{
        query = {$or: [{fullname : { "$regex": req.params.term.trim(), "$options": "i" }}]}
    }
    User.find(query).limit(10)
    .populate('groups')
    .exec(function(err, users) {
        if(err){
            return res.status(500).json({
                code: 500,
                error: err
            })
        }else{
            res.status(200).json({
                code: 200,
                data: users
            })
        }
    });
});

//Add user endpoint
router.post('/add', function (req, res, next) {
    if(!req.body.groups){
        return res.status(400).json({
            code: 400,
            error: "Please select at least one group to add user"
        });
    }else if(!req.body.email){
        return res.status(400).json({
            code: 400,
            error: "Please provide email"
        });
    }else if(!req.body.fullname){
        return res.status(400).json({
            code: 400,
            error: "Please enter Full Name"
        });
    }
    
    User.find({email: req.body.email.trim()}, function (err, users) {
        if (err) {
            return res.status(500).json({
                code: 500,
                error: err
            });
        }else if (users && users.length > 0) {
            return res.status(400).json({
                code: 400,
                error: 'User with this email id already exist'
            });
        }else{
            const newUser = new User({
                fullname: req.body.fullname.trim(),
                email: req.body.email.trim(),
                groups: req.body.groups
            });

            newUser.save(function (err, result) {
                if (err) {
                    return res.status(500).json({
                        code: 500,
                        title: 'An error occurred',
                        error: err
                    });
                }else{
                    res.status(200).json({
                        code:200,
                        message: 'New User Successfully Added',
                        type: 'created',
                        data: result
                    });
                }
            });
        }
    });
});

//Update user endpoint
router.put('/:id', function (req, res, next) {

    if (!req.body.groups || req.body.groups.length === 0) {
        return res.status(400).json({
            code: 400,
            error: "This user is associated with this group only hence can't be removed from this group. To remove the user, go to Users screen."
        })  
    }

    User.find({email: req.body.email.trim()}, function (err, users) {
        if (err) {
            return res.status(500).json({
                code: 500,
                error: err
            });
        }else if (users && users.findIndex(u => u._id != req.params.id) > -1) { // using loose unequality with purpose
            return res.status(400).json({
                code: 400,
                error: 'User with this email id already exist'
            });
        } else {
            User.findById(req.params.id, function (err, user) {
                if (err) {
                    return res.status(500).json({
                        code: 500,
                        error: err
                    });
                }else if (!user) {
                    return res.status(404).json({
                        code: 404,
                        error: 'User not found'
                    });
                }else{
                    user.fullname = req.body.fullname;
                    user.email = req.body.email;
                    user.groups = req.body.groups;
                    user.save(function (err, result) {
                        if (err) {
                            return res.status(500).json({
                                code: 500,
                                error: err
                            });
                        }else{
                            res.status(200).json({
                                code:200,
                                message: 'User Updated'
                            });
                        }
                    });
                }
            });
        }
    });
    
});

//Delete user endpoint
router.delete('/:id', function(req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.status(500).json({
                code: 500,
                error: err
            });
        }else if (!user) {
            return res.status(404).json({
                code: 404,
                error: 'User not found'
            });
        }else{
            user.remove(function (err, result) {
                if (err) {
                    return res.status(500).json({
                        code: 500,
                        error: err
                    });
                }else{
                    res.status(200).json({
                        code: 200,
                        message: 'User deleted',
                        type: 'deleted'
                    });
                }
            });
        }
    });
});

module.exports = router;