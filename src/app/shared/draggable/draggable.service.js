/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2018 freezy <freezy@vpdb.io>
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

export default class DraggableService {

	/**
	 * @ngInject
	 */
	constructor() {
		this.drags = {

		};
	}

	addContainer(dragId, element, opts) {
		if (!this.drags[dragId]) {
			this.drags[dragId] = {};
		}
		if (!this.drags[dragId].containers) {
			this.drags[dragId].containers = [];
		}
		this.drags[dragId].containers.push(element);
		this.drags[dragId].opts = opts;
		this.drags[dragId].inDropZone = false;
	}

	startDrag(dragId, element, opts) {
		if (this.drags[dragId]) {

			if (this.drags[dragId].containers) {
				this.drags[dragId].containers.forEach(element => {
					element.addClass(this.drags[dragId].opts.draggingClass);
					element.on('mouseenter', () => this._mouseEnter(element, this.drags[dragId]));
					element.on('mouseleave', () => this._mouseLeave(element, this.drags[dragId]));
				});
				this.drags[dragId].item = element;
				this.drags[dragId].itemOpts = opts;
			}
		}
	}

	stopDrag(dragId, itemElement) {
		this.drags[dragId].containers.forEach(element => {
			element.removeClass(this.drags[dragId].opts.draggingClass);
			element.off('mouseenter');
			element.off('mouseleave');
			delete this.drags[dragId].data;
		});
		if (this.drags[dragId].inDropZone) {


		} else {
			if (this.drags[dragId].itemOpts.animateDuration) {
				const opts = this.drags[dragId].itemOpts;
				if (opts.animateDuration) {
					const d = opts.animateDuration;
					setTimeout(() => itemElement.css({
						transition: 'transform ' + d + 'ms ease',
						transform: ''
					}), 0);
					setTimeout(() => itemElement.css({
						transition: '',
					}), d);
				}

			} else {
				itemElement.css({
					transition: '',
					top: '',
					left: ''
				});
			}
		}
		delete this.drags[dragId].itemOpts;
	}

	_mouseEnter(element, drag) {
		drag.inDropZone = true;
		element.addClass(drag.opts.hoverClass);
	}
	_mouseLeave(element, drag) {
		drag.inDropZone = false;
		element.removeClass(drag.opts.hoverClass);
	}
}
