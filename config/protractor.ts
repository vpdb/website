import { browser, by, Config } from 'protractor';
import { LoginModalPage } from "../src/app/auth/login.modal.page";

export let config: Config = {
	framework: 'jasmine',
	capabilities: {
		browserName: 'chrome'
	},
	specs: [ '../**/*.spec.js' ],
	seleniumAddress: 'http://localhost:4444/wd/hub',
	params: {
		url: 'http://localhost:3333'
	},
	onPrepare: () => {
		// register root user
		return browser.driver.get('http://localhost:3333')
			.then(() => browser.driver.findElement(by.id('login-btn')).click())
			.then(() => browser.driver.findElement(by.id('login-toggle')).click())
			.then(() => browser.driver.findElement(by.id('register-email')).sendKeys(LoginModalPage.EMAIL))
			.then(() => browser.driver.findElement(by.id('register-username')).sendKeys(LoginModalPage.USERNAME))
			.then(() => browser.driver.findElement(by.id('register-password')).sendKeys(LoginModalPage.PASSWORD))
			.then(() => browser.driver.findElement(by.id('register-submit')).click())
			.then(() => browser.driver.findElement(by.id('dismiss-button')).click());
	}
};