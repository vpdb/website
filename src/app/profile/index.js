import angular from 'angular';
import ProfileCtrl from './profile.ctrl';
import ProfileSettingsCtrl from './profile.settings.ctrl';
import ProfileDownloadsCtrl from './profile.downloads.ctrl';
import ProfileNotificationsCtrl from './profile.notifications.ctrl';
import ProfileStatsCtrl from './profile.stats.ctrl';
import TokenCreateModalCtrl from './token.create.modal.ctrl';
import heightAnimation from './height.animation';

export default angular
	.module('vpdb.profile', [])
	.controller('ProfileCtrl', ProfileCtrl)
	.controller('ProfileSettingsCtrl', ProfileSettingsCtrl)
	.controller('ProfileDownloadsCtrl', ProfileDownloadsCtrl)
	.controller('ProfileNotificationsCtrl', ProfileNotificationsCtrl)
	.controller('ProfileStatsCtrl', ProfileStatsCtrl)
	.controller('TokenCreateModalCtrl', TokenCreateModalCtrl)
	.animation('.height-animation', heightAnimation)
	.name;