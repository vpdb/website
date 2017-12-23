import { by, element } from 'protractor';
import { BasePage } from '../../test/BasePage';

export class TagAddModalPage extends BasePage {

	private name = element(by.id('tag-name'));
	private description = element(by.id('tag-description'));
	private submitButton = element(by.id('submit-btn'));

	setName(name: string) {
		this.name.sendKeys(name);
	}

	setDescription(description: string) {
		this.description.sendKeys(description);
	}

	hasNameValidationError() {
		return this.hasClass(this.formGroup(this.name), 'error');
	}

	hasDescriptionValidationError() {
		return this.hasClass(this.formGroup(this.description), 'error');
	}

	dismiss() {
		element(by.id('cancel-btn')).click();
	}

	submit() {
		this.submitButton.click();
	}
}