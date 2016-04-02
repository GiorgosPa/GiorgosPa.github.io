app = angular.module('app', ['ngMaterial']);

app.directive("aDirective", function() {
    return {
        templateUrl: 'a.html'
    };
});

app.directive("bDirective", function() {
    return {
        templateUrl: 'b.html'
    };
});

app.directive("cDirective", function() {
    return {
        templateUrl: 'c.html'
    };
});

app.directive("dDirective", function() {
    return {
        templateUrl: 'd.html'
    };
});
