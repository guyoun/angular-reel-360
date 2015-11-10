angular.module('angular-reel-360').directive('angularReel', [ function() {
    'use strict';
    return {
      restrict: 'AC',
      link: function(scope, element, attrs) {
        var reelImages = attrs.reelImages;

        var imgLoad = imagesLoaded(element[0], function() {
          $(element[0]).reel({
            images: reelImages
          });

          if (!scope.$$phase) {
            scope.$apply();
          }
        });
      }
    };
  }
]);
