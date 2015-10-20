var gamesApp = angular.module('gamesApp', ['ngRoute', 'ngResource']);

var baseUrl = 'http://localhost:3000';

gamesApp.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'mainController'
        })

        .when('/#', {
            templateUrl: 'views/main.html',
            controller: 'mainController'
        })

});

gamesApp.factory('postService', function($resource) {
    return $resource(baseUrl+'/api/posts/:id');
});

gamesApp.controller('mainController', function(postService, $scope,$http){
    $scope.posts = postService.query();
    $scope.editMode = false;
    //set default to 1
    $scope.counter = 1;
    $scope.images = [0];
    $scope.newPost = {created_by: '', name: '',description:'', created_at: '', images: []};
    $scope.addOption = function(){
        $scope.images.push($scope.counter);
        $scope.counter ++;


    };
    $scope.addOptionFor= function(post){

        post.images = $scope.union(post.images,['']);
    };
    $scope.removeOption = function(index){
        $scope.images.splice($scope.images.indexOf(index),1);
    };
    $scope.removeOptionFor = function(post,index){
        post.images.splice($scope.images.indexOf(index),1);
    };
    $scope.deletePost = function(index){
        var postToDelete = $scope.posts[$scope.posts.length - index-1];
        $http.delete(baseUrl+'/api/posts/'+postToDelete._id );
        $scope.posts = postService.query();

    };
    $scope.savePost = function(post){
        $http.put(baseUrl+'/api/posts/'+post._id,post);
        $scope.posts = postService.query();

    };
    $scope.post = function(){

        postService.save($scope.newPost, function() {
            $scope.posts = postService.query();
            $scope.newPost = {created_by: '',name: '', description: '',created_at: '', images: []};
        });
    };
});

