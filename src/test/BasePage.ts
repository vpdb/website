import { by, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

export class BasePage {

	protected hasClass(input: ElementFinder, className:string): promise.Promise<boolean> {
		return input.getAttribute('class').then(classes => {
			return classes.split(' ').indexOf(className) > -1;
		});
	}

	protected formGroup(input: ElementFinder): ElementFinder {
		return input.element(by.xpath('./ancestor::div[contains(concat(" ", @class, " "), " form-group ")][1]'));
	}
}