/**
 * @param $rootScope
 * @param $localStorage
 * @param $timeout
 * @return {{response: response}}
 * @ngInject
 */
export default function($rootScope, $localStorage, $timeout) {
	return {
		response: function(response) {
			const sha = response.headers('x-app-sha');
			if (sha && $localStorage.appSha && $localStorage.appSha !== sha) {
				$timeout(() => $rootScope.$emit('appUpdated'), 300);
			}
			if (sha) {
				$localStorage.appSha = sha;
			}
			return response;
		}
	};
}