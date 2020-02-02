var User = require('../models/user');
var Opinion = require('../models/opinion');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all User.
exports.user_list = function(req, res, next) {
    User.find()
      .sort([['login', 'ascending']])
      .exec(function (err, list_user) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('user_list', { title: 'User List', user_list: list_user });
      });
  };

// Display detail page for a specific User.
exports.user_detail = function(req, res, next) {

    async.parallel({
        user: function(callback) {
          User.findById(req.params.id)
              .exec(callback)
        },
        user_opinion: function(callback) {
          Opinion.find({ 'user_id': req.params.id },'title')
            .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.user==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('user_detail', { title: 'User Detail', user: results.user, user_opinion: results.user_opinion } );
    });

};

// Display User create form on GET.
exports.user_create_get = function(req, res, next) {       
    res.render('user_form', { title: 'Create User'});
};

// Handle User create on POST.
exports.user_create_post = [

    // Validate fields.
    body('login').isLength({ min: 1 }).trim().withMessage('You must enter login.')
        .isAlphanumeric().withMessage('Login has non-alphanumeric characters.'),
    body('password').isLength({ min: 1 }).trim().withMessage('You must enter password.'),
    body('role').isLength({ min: 1 }).trim().withMessage('You must enter role.'),

    // Sanitize fields.
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            // There are errors. Render form again with sanitized values/errors messages.
            res.render('user_form', { title: 'Create User', user: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an User object with escaped and trimmed data.
            var user = new User(
                {
                    login: req.body.login,
                    password: req.body.password,
                    about_me: req.body.about_me,
                    created_at: req.body.created_at,
                    deleted_at: req.body.deleted_at,
                    role_id: req.body.role,
                    avatar_id: req.body.avatar_id
                });
            user.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new user record.
                res.redirect(user.url);
            });
        }
    }
];

// Display User delete form on GET.
exports.user_delete_get = function(req, res, next) {

    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback)
        },
        user_opinion: function(callback) {
          Opinion.find({ 'user': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.user==null) { // No results.
            res.redirect('/user');
        }
        // Successful, so render.
        res.render('user_delete', { title: 'Delete User', user: results.user, user_opinion: results.user_opinion } );
    });

};

// Handle User delete on POST.
exports.user_delete_post = function(req, res, next) {

    async.parallel({
        user: function(callback) {
          User.findById(req.body.userid).exec(callback)
        },
        user_opinion: function(callback) {
          Opinion.find({ 'user': req.body.userid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.user_opinion.length > 0) {
            // User has opinions. Render in same way as for GET route.
            res.render('user_delete', { title: 'Delete User', user: results.user, user_opinion: results.user_opinion } );
            return;
        }
        else {
            // User has no opinions. Delete object and redirect to the list of user.
            User.findByIdAndRemove(req.body.userid, function deleteUser(err) {
                if (err) { return next(err); }
                // Success - go to user list
                res.redirect('/user')
            })
        }
    });
};

// Display User update form on GET.
exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST.
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};
