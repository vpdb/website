/**
 * @param $httpProvider
 * @ngInject
 */
export default function($httpProvider) {
	$httpProvider.interceptors.push('UpdateInterceptor');
}