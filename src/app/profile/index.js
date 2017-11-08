import angular from 'angular';
import ProfileCtrl from './profile.ctrl';
import ProfileSettingsCtrl from './profile.settings.ctrl';
import ProfileDownloadsCtrl from './profile.downloads.ctrl';
import ProfileNotificationsCtrl from './profile.notifications.ctrl';
import ProfileStatsCtrl from './profile.stats.ctrl';

export default angular
	.module('vpdb.profile', [])
	.controller('ProfileCtrl', ProfileCtrl)
	.controller('ProfileSettingsCtrl', ProfileSettingsCtrl)
	.controller('ProfileDownloadsCtrl', ProfileDownloadsCtrl)
	.controller('ProfileNotificationsCtrl', ProfileNotificationsCtrl)
	.controller('ProfileStatsCtrl', ProfileStatsCtrl)
	.name;