/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

import apm from '../apm';

/**
 * APM service.
 *
 * Currently integrates with Elastic APM.
 *
 * @see https://www.elastic.co/guide/en/apm/server/current/rum.html
 * @see https://www.elastic.co/guide/en/apm/agent/js-base/current/api.html
 * @author freezy <freezy@vpdb.io>
 */
export default class ApmService {

	/**
	 * @param $rootScope
	 * @param $transitions
	 * @ngInject
	 */
	constructor($rootScope, $transitions) {
		this.waitCoolDown = 500;
		this.$rootScope = $rootScope;
		this.$transitions = $transitions;
	}

	init() {
		if (apm) {

			this._transactionEnd = 0;
			this._transactionFinished = false;

			// trigger start
			this.$transitions.onStart({}, transition => {
				this._transactionStart = window.performance.now();
				this._transactionFinished = false;
				const to = transition.to();
				apm.startTransaction(to.url, 'page-load');
			});

			// trigger end (route)
			this.$transitions.onSuccess({}, () => {
				this._clearTimeout();
				this._waitForNextEvent();
			});

			// trigger end (network)
			this.$rootScope.$on('loading:start', () => {
				this._clearTimeout();
			});
			this.$rootScope.$on('loading:finish', () => {
				this._clearTimeout();
				this._waitForNextEvent();
			});
		}
	}

	addTags(tags) {
		if (apm) {
			apm.addTags(tags);
		}
	}

	setUserContext(id, username, email) {
		if (apm) {
			apm.setUserContext({ id, username, email });
		}
	}

	_clearTimeout() {
		if (this.waitTimeout) {
			clearTimeout(this.waitTimeout);
		}
	}

	_waitForNextEvent() {
		if (!this._transactionFinished) {
			this._transactionEnd = window.performance.now();
			this.waitTimeout = setTimeout(() => this._onPageLoaded(), this.waitCoolDown);
		}
	}

	_onPageLoaded() {
		console.log('Page finished loading in %sms (%sms ago).', this._transactionEnd - this._transactionStart, window.performance.now() - this._transactionEnd);
		const transaction = apm.getCurrentTransaction();
		if (transaction) {
			transaction.end();
			transaction._end = this._transactionEnd;
		}
		this._transactionFinished = true;
	}
}
