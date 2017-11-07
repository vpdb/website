import angular from 'angular';
import AboutCtrl from './about.ctrl';
import RulesCtrl from './rules.ctrl';
import FaqCtrl from './faq.ctrl';
import LegalCtrl from './legal.ctrl';
import PrivacyCtrl from './privacy.ctrl';

export default angular
	.module('vpdb.content', [])
	.controller('AboutCtrl', AboutCtrl)
	.controller('RulesCtrl', RulesCtrl)
	.controller('FaqCtrl', FaqCtrl)
	.controller('LegalCtrl', LegalCtrl)
	.controller('PrivacyCtrl', PrivacyCtrl)
	.name;