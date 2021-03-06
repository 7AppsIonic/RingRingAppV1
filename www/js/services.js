// NEWS FEED SERVICES

var feeds = [];

app.factory('FeedLoader', function ($resource) {
    return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
        fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
    });
});

app.service('FeedList', function ($rootScope, FeedLoader, $q) {
    this.get = function(num) {
        var deferred= $q.defer();
        var feedSources = [
            {title: 'Time', url: 'http://time.com/feed/'},
            {title: 'Mashable', url: 'http://mashable.com/feed/'},
            {title: 'Wordpress', url: 'https://en.blog.wordpress.com/feed/'}
        ];
        if (feeds.length === 0) {
            for (var i=0; i<feedSources.length; i++) {
                FeedLoader.fetch({q: feedSources[i].url, num: num}, {}, function (data) {
                    var feed = data.responseData.feed;
                    feeds.push(feed);
                    deferred.resolve(feeds);
                });
            }
        }

        return deferred.promise;
    };
});



// WORDPRESS FEED SERVICES

app.service('Blog', function($http) {
    var address = 'http://swepps.com/wp/api/';
    this.categories = function() { 
        var url = address + "get_category_index?callback=JSON_CALLBACK";
        return $http.jsonp(url);
    };
    this.posts = function(cat) { 
        var url = address + "get_posts?cat="+cat+"&callback=JSON_CALLBACK";
        return $http.jsonp(url);
    };
    this.post = function(id) { 
        var url = address + "get_post?post_id="+id+"&callback=JSON_CALLBACK";
        return $http.jsonp(url);
    };
});





// FIREBASE SERVICES

app.service('Firebase', function() {
    this.url = function(id) { 
        var url = "https://ionicrevolution-77640.firebaseio.com";
        return url;
    };
});








// OWL CAROUSEL DIRECTIVES

app.directive("owlCarousel", function() {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function(element) {
              // provide any default options you want
                var defaultOptions = {
                };
                var customOptions = scope.$eval($(element).attr('data-options'));
                // combine the two options objects
                for(var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }
                // init carousel
                $(element).owlCarousel(defaultOptions);
            };
        }
    };
});

app.directive('owlCarouselItem', function() {
    return {
        restrict: 'A',
        transclude: false,
        link: function(scope, element) {
          // wait for the last item in the ng-repeat then call init
            if(scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
});




  