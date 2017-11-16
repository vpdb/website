import { isObject } from 'lodash';
import * as videojs from 'video.js';

/**
 * @todo Check what's wrong with https://github.com/LonnyGomes/vjs-video or use it
 * @param $parse
 * @param $http
 * @param $timeout
 * @param {AuthService} AuthService
 * @ngInject
 */
export default function($parse, $http, $timeout, AuthService) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			attrs.type = attrs.type || "video/mp4";

			const setup = {
				techOrder: ['html5', 'flash'],
				controls: true,
				preload: 'metadata',
				autoplay: false,
				loop: true
			};

			const videoid = Math.round(Math.random() * 1000000);
			attrs.id = "videojs" + videoid;
			element.attr('id', attrs.id);

			let player = null;
			attrs.$observe('videoSrc', function(value) {

				// TODO this is ugly. find out why we have a string here instead of an object.
				if (value[0] === '{') {
					value = $parse(value)();
				}
				const url = isObject(value) ? value.url : value;
				let isProtected = isObject(value) ? value.is_protected : false;

				if (url) {

					// only display progess if we have nothing after 1s
					const timeout = $timeout(() => scope.videoLoading = true, 1000);

					const waitAndSetUrl = function(url) {
						element.attr('source', url);
						$http({ method: 'HEAD', url: url }).success(() => {
//								console.log(new Date() + ' Back from HEAD, id = %s', attrs.id);
							const src = { type: 'video/mp4', src: url };
							if (!player) {
								player = videojs(attrs.id, setup, function() {
									this.src(src);
								});
							} else {
								player.src(src);
							}

							$timeout.cancel(timeout);
							scope.videoLoading = false;
							scope.$emit('videoLoaded');

						}).error((data, status) => {
							console.error('Error fetching HEAD of uploaded video: ' + status);
							console.error(data);
						});
					};

					if (!isProtected) {
						waitAndSetUrl(url);
					} else {
						AuthService.addUrlToken(url, waitAndSetUrl);
					}
				}

				if (!value && player) {
					scope.$emit('videoUnloaded');
				}
			});

			scope.$on('$destroy', function() {
				if (player) {
					player.dispose();
					player = null;
				}
			});
		}
	};
}