#angular-simple-permission

------

You must get current user permissions before angular app start.

the  simple example like :
```javascript
(function(document,$,angular){
  angular.element(document).ready(function() {
    $.ajax({
      url: '/api/get_user_permission',
      type: "GET",
      dataType: 'json'
    }).then(function(data){
        for (var i = 0; i < data.permissions.length; i++) {
          data.permissions[i] = data.permissions[i].replace(/\s/g,"");
        };
        angular.module('myApp').run(['$rootScope', function($rootScope){
          $rootScope.userPermissionList = data.permissions;
        }]);
        angular.bootstrap(document, ['myApp']);
    });
  });
})(document,jQuery,angular);
```

You can code by yourself about the module for the condition without permission. They have already been marked in the module.  

Defaut action is redirect to '/unauthorized' page. 

Chinese friends plz see my blog: http://my.oschina.net/blogshi/blog/300595