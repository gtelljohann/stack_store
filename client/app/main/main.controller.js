'use strict';

angular.module('stackStoreApp')
  .config(function(){
    //  window.Stripe.setPublishableKey('pk_test_SfHPLGrI9nwZrQOGPcFCWkzN');
  })
  .controller('MainCtrl', function ($scope, $http, socket, $modal, $window) {
    $scope.awesomeThings = [];
    $scope.orderItems = [];
    $scope.showCartDropdown = false;
    $scope.stripeEmail = "";
    $scope.select

    $http.get('/api/things').success(function(awesomeThings, index) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });


    $scope.getLineItems = function () {
    $http.get('/api/lineItems').success(function(lineItems){
      $scope.orderItems = lineItems;
      $scope.cartTotal = 0;
      lineItems.forEach(function(lineItem) {
        $scope.cartTotal += lineItem.value * lineItem.quantity;
      });
    });
    }
    $scope.getLineItems();



    $scope.deleteLineItem = function(lineItem) {
      $http.delete('/api/lineItems/' + lineItem._id);
      $scope.getLineItems();
    };

    $scope.updateLineItemQuantity = function (lineItem) {
      console.log(lineItem);
      $http.put('/api/lineItems/' + lineItem._id, lineItem);
      $scope.getLineItems();
    }

    $scope.editLineItem = function (lineItem) {
     console.log(lineItem);
    }


    $scope.toggleShowCartDropdown = function () {
      $scope.showCartDropdown = !$scope.showCartDropdown;
    }

    $scope.openCheckout = function () {
      $scope.modal = $modal.open({
        templateUrl: "../../components/modal/stripeModal.html",
        scope: $scope
      })
    }

    $scope.stripeCallback = function (code, result) {
      if (result.error) {
        window.alert('it failed! error: ' + result.error.message);
      } else {
        window.alert('success! token: ' + result.id);
        $http.post("/api/stripes", {
          token: result.id,
          email: $scope.stripeEmail,
          amount: $scope.cartTotal
        });
      }

    };




    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };



    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });


  });
