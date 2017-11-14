import ReleaseAddVersionCtrl from './release.add.version.ctrl';

export default class ReleaseSelectPlayfieldModalCtrl {

	constructor(App, params) {
		this.App = App;
		this.images = ReleaseAddVersionCtrl.getCompatiblePlayfieldImages(params.release, params.file);
	}
}