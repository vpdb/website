import { browser } from "protractor";
import { FileHelper } from "../../test/FileHelper";

describe('Add new game', () => {

	const fileHelper = new FileHelper(browser.params.vpdb);

	it('should display validation errors', () => {
		fileHelper.uploadBackglass().then((backglass:File) => {

		})
	});

});
