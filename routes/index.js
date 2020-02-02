var express = require('express');
var router = express.Router();

// Require controller modules.
var opinion_controller = require('../controllers/opinionController');
var user_controller = require('../controllers/userController');
var category_controller = require('../controllers/categoryController');
var role_controller = require('../controllers/roleController');

/// OPINION ROUTES ///

// GET opinion home page.
router.get('/', opinion_controller.index);

// GET request for creating a Opinion. NOTE This must come before routes that display Opinion (uses id).
router.get('/opinion/create', opinion_controller.opinion_create_get);

// POST request for creating Opinion.
router.post('/opinion/create', opinion_controller.opinion_create_post);

// GET request to delete Opinion.
router.get('/opinion/:id/delete', opinion_controller.opinion_delete_get);

// POST request to delete Opinion.
router.post('/opinion/:id/delete', opinion_controller.opinion_delete_post);

// GET request to update Opinion.
router.get('/opinion/:id/update', opinion_controller.opinion_update_get);

// POST request to update Opinion.
router.post('/opinion/:id/update', opinion_controller.opinion_update_post);

// GET request for one Opinion.
router.get('/opinion/:id', opinion_controller.opinion_detail);

// GET request for list of all Opinion items.
router.get('/opinion', opinion_controller.opinion_list);

/// USER ROUTES ///

// GET request for creating User. NOTE This must come before route for id (i.e. display user).
router.get('/user/create', user_controller.user_create_get);

// POST request for creating User.
router.post('/user/create', user_controller.user_create_post);

// GET request to delete User.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete User.
router.post('/user/:id/delete', user_controller.user_delete_post);

// GET request to update User.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update User.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request for one User.
router.get('/user/:id', user_controller.user_detail);

// GET request for list of all Users.
router.get('/users', user_controller.user_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category. NOTE This must come before route that displays Category (uses id).
router.get('/category/create', category_controller.category_create_get);

//POST request for creating Category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete Category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete Category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update Category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update Category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one Category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all Category.
router.get('/categorys', category_controller.category_list);

/// ROLES ROUTES ///

// GET request for creating User. NOTE This must come before route for id (i.e. display user).
router.get('/user/create', user_controller.user_create_get);

// POST request for creating User.
router.post('/user/create', user_controller.user_create_post);

// GET request to delete User.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete User.
router.post('/user/:id/delete', user_controller.user_delete_post);

// GET request to update User.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update User.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request for one User.
router.get('/user/:id', user_controller.user_detail);

// GET request for list of all Users.
router.get('/users', user_controller.user_list);

/// ROLES ROUTES ///

// GET request for creating a Role. 
router.get('/admin/roles/create', role_controller.role_create_get);

//POST request for creating Category.
router.post('/admin/roles/create', role_controller.role_create_post);

// GET request to delete Category.
router.get('/admin/roles/:id/delete', role_controller.role_delete_get);

// POST request to delete Category.
router.post('/admin/roles/:id/delete', role_controller.role_delete_post);

// GET request to update Category.
router.get('/admin/roles/:id/update', role_controller.role_update_get);

// POST request to update Category.
router.post('/admin/roles/:id/update', role_controller.role_update_post);

// GET request for one Category.
router.get('/admin/roles/:id', role_controller.role_detail);

// GET request for list of all Category.
router.get('/admin/roles', role_controller.role_list);

module.exports = router;
