app = angular.module('app', []);

app.directive("aDirective", function() {
    return {
        templateUrl: 'a.html'
    };
});

app.directive("bDirective", function() {
    return {
        templateUrl: 'b.html',
        controller: 'scaterController'
    };
});

app.directive("cDirective", function() {
    return {
        templateUrl: 'c.html',
        controller: 'barchartController'
    };
});

app.directive("dDirective", function() {
    return {
        templateUrl: 'd.html',
        controller: 'clusteringController'
    };
});
