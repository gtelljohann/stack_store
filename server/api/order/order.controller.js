'use strict';

var _ = require('lodash');
var Order = require('./order.model');
var User = require('../user/user.model');

// Get list of orders
exports.index = function(req, res) {
  Order.find()
    .populate('user orderItems')
    .exec(function(err, orders) {
      if (err) {
        return handleError(res, err);
      }
      Order.populate(orders, {
        path: 'orderItems.item',
        model: 'Item'
      }, function(err, orders) {
        if (err) {
          return handleError(res, err);
        }
        console.log("here are the orders", orders);
        return res.json(200, orders);

      })
    })


  // Order.find(function(err, orders) {
  //   if (err) {
  //     return handleError(res, err);
  //   }
  //   console.log('All orders, initially: ', orders);
  //   Order.populate(orders, 'orderItems', function() {

  //     console.log('All orders, populated with lineitems: ', orders);
  //     Order.populate(orders, {
  //       path: 'orderItems.item',
  //       model: 'Item'
  //     }, function() {

  //       //console.log('All orders, populated with items: ', orders);
  //       Order.populate(orders, 'user', function() {

  //         //console.log('All orders, populated with users: ', orders);
  //         return res.json(200, orders);

  //       });
  //     });
  //   });
  // });
};

// Get a single order
exports.show = function(req, res) {
  Order.findById(req.params.id)
    .populate('orderItems user')
    .exec(function(err, order) {
      console.log(req.params.id);
      console.log("------");
      console.log(order);
      console.log("------");
      if (err) {
        return handleError(res, err);
      }
      if (!order) {
        return res.send(404);
      }

      Order.populate(order, {
        path: 'orderItems.item',
        model: 'Item'
      }, function(err, data) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(order);

      });
    });



  // console.log(req.params.id);
  // Order.findById(req.params.id, function(err, order) {


  //   if (err) {
  //     return handleError(res, err);
  //   }
  //   if (!order) {
  //     return res.send(404);
  //   }

  //   Order.populate(order, 'orderItems', function() {
  //     Order.populate(order, {
  //       path: 'orderItems.item',
  //       model: 'Item'
  //     }, function() {
  //       Order.populate(order, 'user', function() {
  //         return res.json(order);

  //       });
  //     });
  //   });
  // });
  // .populate('orderItems')
  // .exec(function(err, orderItems){
  //   console.log(err + orderItems);
  // });

};
// exports.show = function(req, res) {
//   Order.findById(req.params.id)
//     .populate(order, 'orderItems user')
//     .exec(function(err) {
//       if (err) {
//         return handleError(res, err);
//       }
//       if (!order) {
//         return res.send(404);
//       }
//       Order.populate(order, {
//           path: 'orderItems.item',
//           model: 'Item'
//         })
//         .exec(function(err) {
//           if (err) {
//             return handleError(res, err);
//           }
//           return res.json(order);

//         });
//     });



//   // console.log(req.params.id);
//   // Order.findById(req.params.id, function(err, order) {


//   //   if (err) {
//   //     return handleError(res, err);
//   //   }
//   //   if (!order) {
//   //     return res.send(404);
//   //   }

//   //   Order.populate(order, 'orderItems', function() {
//   //     Order.populate(order, {
//   //       path: 'orderItems.item',
//   //       model: 'Item'
//   //     }, function() {
//   //       Order.populate(order, 'user', function() {
//   //         return res.json(order);

//   //       });
//   //     });
//   //   });
//   // });
//   // .populate('orderItems')
//   // .exec(function(err, orderItems){
//   //   console.log(err + orderItems);
//   // });
// };

// Creates a new order in the DB.
exports.create = function(req, res) {
  Order.create(req.body, function(err, order) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, order);
  });
};

// Updates an existing order in the DB.
exports.update = function(req, res) {
  //debugger;
  console.log(req.body);
  if (req.body._id) {
    delete req.body._id;
  }
  Order.findById(req.params.id, function(err, order) {
    if (err) {
      return handleError(res, err);
    }
    if (!order) {
      return res.send(404);
    }

    order.orderItems = order.orderItems.concat(req.body);

    order.markModified('orderItems');

    order.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, order);
    })

    // var updated = _.merge(order, req.body);
    // updated.save(function(err) {
    //   if (err) {
    //     return handleError(res, err);
    //   }
    //   return res.json(200, order);
    // });
  });
};

// Deletes a order from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function(err, order) {
    if (err) {
      return handleError(res, err);
    }
    if (!order) {
      return res.send(404);
    }
    order.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

exports.checkout = function(req, res) {
  Order.findByIdAndUpdate(req.params.id, {
    status: 'created',
    creationDate: new Date()
  }, function(err, order) {
    Order.create({
      user: req.body._id
    }, function(err, newCart) {
      User.findByIdAndUpdate(req.body._id, {
        cart: newCart._id
      }, function(err, user) {
        res.send(200, order);
      })
    })
  })

}

function handleError(res, err) {
  return res.send(500, err);
}