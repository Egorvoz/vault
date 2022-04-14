const app = angular.module('ssr', []);

app.controller('ssrController', function ($scope, $rootScope, $compile) {
  $scope.username = 'Saitama';
  $scope.login = 'One Punch Man';
  $scope.email = 'saitama@onepunch.man';
  $scope.event = 'Minsk JS #4';

  document.body.rootScope = $rootScope;

  document.body.compile = (template) => {
    const tmp = $compile(template)($scope);

    $scope.$apply();

    return tmp[0].innerHTML;
  };
})
