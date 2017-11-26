import { by, ElementFinder } from 'protractor';

export class ModalErrorInfoPage {

	title = this.element.element(by.exactBinding ('vm.data.title'));
	subtitle = this.element.element(by.exactBinding ('vm.data.subtitle'));
	message = this.element.element(by.exactBinding ('vm.data.message'));
	closeButton = this.element.element(by.id ('modal-close'));

	constructor(public element: ElementFinder) {
	}

	close() {
		this.closeButton.click();
	}
}