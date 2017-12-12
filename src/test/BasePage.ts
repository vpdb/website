import { by, element, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

export class BasePage {

	/**
	 * Returns true if a node has a given class.
	 *
	 * @param {ElementFinder} input Element to match
	 * @param {string} className Class name to check
	 * @returns {promise.Promise<boolean>}
	 */
	protected hasClass(input: ElementFinder, className:string): promise.Promise<boolean> {
		return input.getAttribute('class').then(classes => {
			return classes.split(' ').indexOf(className) > -1;
		});
	}

	/**
	 * Returns the first parent of the given element with class `form-group`.
	 *
	 * @param {ElementFinder} input Node to start with
	 * @return {ElementFinder}
	 */
	protected formGroup(input: ElementFinder): ElementFinder {
		return input.element(by.xpath('./ancestor::div[contains(concat(" ", @class, " "), " form-group ")][1]'));
	}

	/**
	 * Returns a child of a parent with a given ID that has a child with
	 * the given text.
	 *
	 * - The parent can be any element
	 * - The text node can be any element
	 * - Per default, the returned node is a `li` with class `panel`
	 *
	 * @param {string} parentId ID of the parent
	 * @param {string} text Text to find
	 * @param {string} [nodeElement=li] Element of the returned node
	 * @param {string} [nodeClass=panel] Class of the returned node
	 * @return {ElementFinder}
	 */
	protected parentWithText(parentId:string, text:string, nodeElement:string='li', nodeClass:string='panel'): ElementFinder {
		return element(by.xpath(`//*[@id='${parentId}']//*[contains(text(),'${text}')]/ancestor::${nodeElement}[contains(concat(" ", @class, " "), " ${nodeClass} ")][1]`));
	}
}