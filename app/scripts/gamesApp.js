var gamesApp = angular.module('gamesApp', ['ngRoute', 'ngResource']);
//
//gamesApp.run(function($rootScope, $http) {
//    $rootScope.isAuthenticated = true;
//    //$rootScope.current_user = '';
//    //$rootScope.signout = function() {
//    //    $http.get('/auth/signout');
//    //    $rootScope.isAuthenticated = false;
//    //    $rootScope.current_user = '';
//    //};
//});

var baseUrl = 'http://localhost:3000';

gamesApp.config(function($routeProvider) {
    $routeProvider

        //main page
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })

        .when('/#', {
            templateUrl: 'main.html',
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
    $scope.union = function(a,b){
        var c = a;
        var exist = false;
        for(var i = 0; i<=b.length;i++){
            for(var j = 0;j<= a.length; j++)
            {
                if(b[i] === a[j])
                {
                    exist = true;
                }
            }
            if(!exist)
            {
                c.push(b[i]);
            }
            exist = false;
        }
        return c;
    };
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

