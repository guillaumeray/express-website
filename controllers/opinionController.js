var Opinion = require('../models/opinion');
var User = require('../models/user');
var Category = require('../models/opinion_category');
var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res) {   
    
    async.parallel({
        opinion_count: function(callback) {
            Opinion.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        user_count: function(callback) {
            User.countDocuments({}, callback);
        },
        category_count: function(callback) {
            Category.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Opinion WEBSITE', error: err, data: results });
    });
};

// Display list of all opinions.
exports.opinion_list = function(req, res, next) {
    Opinion.find({}, 'title')
      .populate('user')
      .exec(function (err, list_opinions) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('opinion_list', { title: 'Opinion List', opinion_list: list_opinions });
      }); 
  };

// Display detail page for a specific opinion.
exports.opinion_detail = function(req, res, next) {
    async.parallel({
        opinion: function(callback) {
            Opinion.findById(req.params.id)
              .populate('user')
              .populate('category')
              .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.opinion==null) { // No results.
            var err = new Error('Opinion not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('opinion_detail', { title: results.opinion.title, opinion: results.opinion } );
    });
};

// Display opinion create form on GET.
exports.opinion_create_get = function(req, res, next) { 
      
    // Get all users and category, which we can use for adding to our opinion.
    async.parallel({
        users: function(callback) {
            User.find(callback);
        },
        category: function(callback) {
            Category.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('opinion_form', { title: 'Create Opinion', users: results.users, category: results.category });
    });
    
};

// Handle opinion create on POST.
exports.opinion_create_post = [
    // Convert the category to an array.
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category==='undefined')
            req.body.category=[];
            else
            req.body.category=new Array(req.body.category);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('user', 'User must not be empty.').isLength({ min: 1 }).trim(),
    body('content', 'Cntent must not be empty.').isLength({ min: 1 }).trim(),
    body('category', 'Category must not be empty.').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Opinion object with escaped and trimmed data.
        var opinion = new Opinion(
          { title: req.body.title,
            user: req.body.user,
            content: req.body.content,
            category: req.body.category
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all users and category for form.
            async.parallel({
                users: function(callback) {
                    User.find(callback);
                },
                category: function(callback) {
                    Category.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected category as checked.
                for (let i = 0; i < results.category.length; i++) {
                    if (opinion.category.indexOf(results.category[i]._id) > -1) {
                        results.category[i].checked='true';
                    }
                }
                res.render('opinion_form', { title: 'Create Opinion',users:results.users, category:results.category, opinion: opinion, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save opinion.
            opinion.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new opinion record.
                   res.redirect(opinion.url);
                });
        }
    }
];

// Display opinion delete form on GET.
exports.opinion_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Opinion delete GET');
};

// Handle opinion delete on POST.
exports.opinion_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Opinion delete POST');
};

// Display opinion update form on GET.
exports.opinion_update_get = function(req, res, next) {

    // Get opinion, users and category for form.
    async.parallel({
        opinion: function(callback) {
            Opinion.findById(req.params.id).populate('user').populate('category').exec(callback);
        },
        users: function(callback) {
            User.find(callback);
        },
        category: function(callback) {
            Category.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.opinion==null) { // No results.
                var err = new Error('Opinion not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected category as checked.
            for (var all_g_iter = 0; all_g_iter < results.category.length; all_g_iter++) {
                for (var opinion_g_iter = 0; opinion_g_iter < results.opinion.category.length; opinion_g_iter++) {
                    if (results.category[all_g_iter]._id.toString()==results.opinion.category[opinion_g_iter]._id.toString()) {
                        results.category[all_g_iter].checked='true';
                    }
                }
            }
            res.render('opinion_form', { title: 'Update Opinion', users: results.users, category: results.category, opinion: results.opinion });
        });

};

// Handle opinion update on POST.
exports.opinion_update_post = [

    // Convert the category to an array
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category==='undefined')
            req.body.category=[];
            else
            req.body.category=new Array(req.body.category);
        }
        next();
    },
   
    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('user', 'User must not be empty.').isLength({ min: 1 }).trim(),
    body('content', 'Content must not be empty.').isLength({ min: 1 }).trim(),
    body('category', 'category must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Opinion object with escaped/trimmed data and old id.
        var opinion = new Opinion(
          { title: req.body.title,
            user: req.body.user,
            content: req.body.content,
            category: req.body.category,
            category: (typeof req.body.category==='undefined') ? [] : req.body.category,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all users and category for form.
            async.parallel({
                users: function(callback) {
                    User.find(callback);
                },
                category: function(callback) {
                    Category.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected category as checked.
                for (let i = 0; i < results.category.length; i++) {
                    if (opinion.category.indexOf(results.category[i]._id) > -1) {
                        results.category[i].checked='true';
                    }
                }
                res.render('opinion_form', { title: 'Update Opinion',users: results.users, category: results.category, opinion: opinion, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Opinion.findByIdAndUpdate(req.params.id, opinion, {}, function (err,opinion) {
                if (err) { return next(err); }
                   // Successful - redirect to opinion detail page.
                   res.redirect(opinion.url);
                });
        }
    }
];