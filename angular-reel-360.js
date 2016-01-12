angular.module('angular-reel-360', []);

angular.module('angular-reel-360').run(['$templateCache', function ($templateCache) {
    'use strict';

    $templateCache.put('angular-reel-template.html',
        "<div ng-show=\"mode == 'normal'\"> <img id=\"{{image_id}}\" ng-src=\"{{image}}\" class='{{normal_image_class}}'></div><div ng-show=\"mode == 'large'\"> <img id=\"{{large_image_id}}\" ng-src=\"{{frame_image_src}}\" class='{{large_image_class}}'> </div>"
    );
}]);

angular.module('angular-reel-360').directive('angularReel', [function () {
    'use strict';

    return {
        restrict: 'A',
        scope: {
            images: '=images',
            image: '=image',
            id: '=?id',
            use_magnify: '=?useMagnify',
            control: '=?control',
            get_large_image: '=?getLargeImage',
            normal_image_class: '=?normalImageClass',
            large_image_class: '=?largeImageClass'
        },
        link: function (scope, element, attrs) {
            var image_id = 'angular-reel-' + scope.$id + '-' + scope.id;
            var large_image_id = image_id + '-large';

            if (typeof(scope.normal_image_class) == 'undefined') {
                scope.normal_image_class = 'img-responsive';
            }

            if (typeof(scope.large_image_class) == 'undefined') {
                scope.large_image_class = 'img-responsive';
            }

            scope.image_id = image_id;
            scope.large_image_id = large_image_id;
            scope.mode = "normal";

            var reelImages = scope.images;

            var imgLoad = imagesLoaded($("#" + image_id), function () {
                $("#" + image_id).reel({
                    shy: true,
                    steppable: false,
                    images: reelImages
                });

                if (!scope.$$phase) {
                    scope.$apply();
                }
            });

            var change_mode = function (mode) {
                if (!scope.use_magnify)
                    return;

                mode = mode || null;
                if (mode != null) {
                    if (scope.mode == mode)
                        return;
                }

                if (scope.mode == 'normal') {
                    var frame_image_src = $('#' + image_id).attr('src');
                    var large_image_src = frame_image_src;

                    scope.frame_image_src = frame_image_src;
                    if (typeof(scope.get_large_image) != 'undefined') {
                        large_image_src = scope.get_large_image(frame_image_src)
                    }
                    $('#' + large_image_id).magnify({
                        speed: 200,
                        src: large_image_src
                    });
                    scope.mode = 'large';
                }
                else {
                    scope.mode = 'normal';
                }
            }

            if (scope.use_magnify == true) {
                element.on('dblclick', function () {
                    if (!scope.$$phase) {
                        scope.$apply(function () {
                            change_mode();
                        });
                    }
                });
            }

            if (scope.control) {
                scope.control.change_mode = change_mode;
            }
        },
        templateUrl: 'angular-reel-template.html'
    };
}
]);
