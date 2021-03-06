/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/giftcards', require('./api/giftcard'));
  app.use('/api/stripes', require('./api/stripe'));
  app.use('/api/categorys', require('./api/category'));
  app.use('/api/orders', require('./api/order'));
  app.use('/api/reviews', require('./api/review'));
  app.use('/api/lineItems', require('./api/lineItem'));
  app.use('/api/items', require('./api/item'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
