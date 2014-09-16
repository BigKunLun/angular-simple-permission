/**
 * angular permission module 
 * 
 * need jquery and underscore,If you don't want to use them,it's easy to edit.
 * 
 */
var userPermissionList;

angular.element(document).ready(function() {
  $.ajax({
    url: '/api/get_user_permission',
    type: "GET",
    dataType: 'json'
  }).then(function(data){
      for (var i = 0; i < data.permissions.length; i++) {
        data.permissions[i] = data.permissions[i].replace(/\s/g,"");
      };
      userPermissionList = data.permissions;
      angular.bootstrap(document, ['javis']);
  });
});

angular.module('javis.permission', ['ngRoute'])

  .config(['$httpProvider', function($httpProvider) {
      $httpProvider.responseInterceptors.push('HttpResponseInterceptor');
    }
  ])

  // permission check
  .factory('$permissions_jvs', ['$rootScope',function ($rootScope) {
    var userPermissionList;
    return {
      setPermissions: function(permissions) {
        userPermissionList = permissions;
        $rootScope.$broadcast('permissionsChanged')
      },
      hasPermission: function (permission) {
        permission = permission.trim();
        return _.contains(userPermissionList,permission);
      }
   };
  }])

  // permission directive
  .directive('hasPermission',['$permissions_jvs',function($permissions_jvs) {
    return {
      link: function(scope, element, attrs) {
        if(!_.isString(attrs.hasPermission))
          throw "hasPermission value must be a string, 你懂了吗亲?";
        var value = attrs.hasPermission.trim();
        var notPermissionFlag = value[0] === '!';
        if(notPermissionFlag) {
          value = value.slice(1).trim();
        }
    
        function toggleVisibilityBasedOnPermission() {
          var hasPermission = $permissions_jvs.hasPermission(value);
    
          if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)
            element.show();
          else
            element.remove();
        }
        toggleVisibilityBasedOnPermission();
        scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
      }
    };
  }])

  // permission http check
  .factory('HttpResponseInterceptor',['$q','$location','$rootScope',function ($q,$location,$rootScope) {
    return function (promise) {
      return promise.then(function (response) {
          $rootScope.$broadcast('notifyBroadCast',response);
          return response;
        }, function (response) {
          if(response.status === 403 || response.status === 401) {
          $rootScope.globalVariables.errorUrl = $location.$$absUrl;
          $location.path('/unauthorized');
          return $q.reject(response);
        }
        $rootScope.$broadcast('notifyBroadCast',response);
        return $q.reject(response);
      });
    };
  }])

  // permission location url check
  .run(['$rootScope','$location','$permissions_jvs','$globalVariables_jvs', function($rootScope,$location,$permissions_jvs,$globalVariables_jvs){

    $permissions_jvs.setPermissions(userPermissionList);

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      var permission = next.$$route.permission;
      if(_.isString(permission) && !$permissions_jvs.hasPermission(permission)){
        $rootScope.globalVariables.errorUrl = $location.$$absUrl;
        $location.path('/unauthorized');
      }
    });
  }])