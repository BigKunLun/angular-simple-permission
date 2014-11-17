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

The module how to deal with no permission condition that you can code by yourself.I have already mark them in module.

Defaut action is redirect to '/unauthorized' page. 

Chinese people can visit my blog: http://my.oschina.net/blogshi/blog/300595