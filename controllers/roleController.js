var Role = require('../models/role');
var User = require('../models/user');
var async = require('async');
const validator = require('express-validator');

// Display list of all Role.
exports.role_list = function(req, res, next) {
    Role.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_roles) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('role_list', { title: 'Role List', role_list: list_roles });
      });
  };

// Display detail page for a specific Role.
exports.role_detail = function(req, res, next) {
    async.parallel({
        role: function(callback) {
            Role.findById(req.params.id)
              .exec(callback);
        },

        role_user: function(callback) {
            User.find({ 'role': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.role==null) { // No results.
            var err = new Error('Role not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('role_detail', { title: 'Role Detail', role: results.role, role_user: results.role_user } );
    });
};

// Display Role create form on GET.
exports.role_create_get = function(req, res, next) {     
    res.render('role_form', { title: 'Create Role' });
};

// Handle Role create on POST.
exports.role_create_post =  [
   
    // Validate that the name field is not empty.
    validator.body('name', 'Role name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (escape) the name field.
    validator.sanitizeBody('name').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validator.validationResult(req);
  
      // Create a role object with escaped and trimmed data.
      var role = new Role(
        { name: req.body.name }
      );
  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('role_form', { title: 'Create Role', role: role, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Role with same name already exists.
        Role.findOne({ 'name': req.body.name })
          .exec( function(err, found_role) {
             if (err) { return next(err); }
  
             if (found_role) {
               // Role exists, redirect to its detail page.
               res.redirect(found_role.url);
             }
             else {
  
               role.save(function (err) {
                 if (err) { return next(err); }
                 // Role saved. Redirect to role detail page.
                 res.redirect(role.url);
               });
  
             }
  
           });
      }
    }
  ];

// Display Role delete form on GET.
exports.role_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Role delete GET');
};

// Handle Role delete on POST.
exports.role_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Role delete POST');
};

// Display Role update form on GET.
exports.role_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Role update GET');
};

// Handle Role update on POST.
exports.role_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Role update POST');
};
