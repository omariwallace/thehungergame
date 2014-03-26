'use strict';

// hungergame.controller('SliderController', function($scope) {
//     $scope.images=[{src:'img1.png',title:'Pic 1'},{src:'img2.jpg',title:'Pic 2'},{src:'img3.jpg',title:'Pic 3'},{src:'img4.png',title:'Pic 4'},{src:'img5.png',title:'Pic 5'}];
// });

angular.module('hungergame.restaurants')
  .controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', 'geolocation', '$http', function ($scope, $stateParams, $location, Global, Restaurants, geolocation, $http) {
    $scope.global = Global;

    // Get player's location;
    geolocation.getLocation().then(function(data) {
        $scope.coords = {'lat':data.coords.latitude, 'long':data.coords.longitude};
        var latLngString = data.coords.latitude + ',' + data.coords.longitude;
        // console.log(latLngString)
        var findNearBy = function(coordString){
            $http({method: 'GET', url: '/restaurants/latitudeLongitude', 
                params: {latLng: coordString}}).
                success(function(data, status, headers, config){
                    console.log(data);
                    $scope.restaurants = data;
                }).
                error(function(data, status, headers, config){
                    console.log(status);
                });
        };
        findNearBy(latLngString);
    });

    // $scope.images = findNearByReturnsobject.foreach({

    // })

    $scope.images = [
        { src:'http://lorempixel.com/500/500',title:'Burger'},
        { src:'http://www.littlebabysicecream.com/wp-content/uploads/2012/09/pizza.jpg',title:'Pizza'},
        { src:'http://www.tacobell.com/static_files/TacoBell/StaticAssets/images/menuItems/pdp/pdp_cantina_burrito_steak.png',title:'Burrito'},
    ];

// http://kalbiburger.com/wp-content/uploads/2010/06/Kalbi_Burger.jpg

    $scope.yes_images = [
        { src:'http://www.littlebabysicecream.com/wp-content/uploads/2012/09/pizza.jpg',title:'Random1'},
        { src:'http://lorempixel.com/500/500',title:'Random2'},
        { src:'http://lorempixel.com/500/500',title:'Random3'}
    ];

// **************************************************** //
    
    $scope.create = function() {
        var restaurant = new Restaurants({
            title: this.title,
            content: this.content
        });
        restaurant.$save(function(response) {
            $location.path('restaurants/' + response._id);
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(restaurant) {
        if (restaurant) {
            restaurant.$remove();

            for (var i in $scope.restaurants) {
                if ($scope.restaurants[i] === restaurant) {
                    $scope.restaurants.splice(i, 1);
                }
            }
        }
        else {
            $scope.restaurant.$remove();
            $location.path('restaurants');
        }
    };

    $scope.update = function() {
        var restaurant = $scope.restaurant;
        if (!restaurant.updated) {
            restaurant.updated = [];
        }
        restaurant.updated.push(new Date().getTime());

        restaurant.$update(function() {
            $location.path('restaurants/' + restaurant._id);
        });
    };

    $scope.find = function() {
        Restaurants.query(function(restaurants) {
            $scope.restaurants = restaurants;
        });
    };

    $scope.findOne = function() {
        Restaurants.get({
            restaurantId: $stateParams.restaurantId
        }, function(restaurant) {
            $scope.restaurant = restaurant;
        });
    };
}]);