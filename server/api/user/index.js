'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/stripetoken', auth.isAuthenticated(), controller.setStripeToken)
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/adminchangepassword', auth.hasRole('admin'), controller.adminChangePassword);
router.put('/:id/makeadmin', auth.hasRole('admin'), controller.makeAdmin);
router.get('/:id/orders', auth.isAuthenticated(), controller.getOrders)
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
