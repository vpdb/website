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

import angular from 'angular';

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
			this.drags[dragId].containers = new Map();
		}
		this.drags[dragId].containers.set(element, { inDropZone: false });
		this.drags[dragId].opts = opts;
	}

	startDrag(dragId, element, opts) {
		if (this.drags[dragId]) {

			if (this.drags[dragId].containers) {
				for (let element of this.drags[dragId].containers.keys()) {
					element.addClass(this.drags[dragId].opts.draggingClass);
					element.on('mouseenter', () => this._mouseEnter(element, this.drags[dragId]));
					element.on('mouseleave', () => this._mouseLeave(element, this.drags[dragId]));
				}
				this.drags[dragId].item = element;
				this.drags[dragId].itemOpts = opts;
			}
		}
	}

	stopDrag(dragId, itemElement) {
		let draggedOverContainer = null;
		for (let element of this.drags[dragId].containers.keys()) {

			// clean class and event listeners
			element.removeClass(this.drags[dragId].opts.draggingClass);
			element.removeClass(this.drags[dragId].opts.hoverClass);
			element.off('mouseenter');
			element.off('mouseleave');

			if (this.drags[dragId].containers.get(element).inDropZone) {
				draggedOverContainer = element;
			}
		}

		if (draggedOverContainer) {
			angular.element(draggedOverContainer).scope().$broadcast('dropped', this.drags[dragId].itemOpts.data);

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

		// clean up item
		delete this.drags[dragId].item;
		delete this.drags[dragId].itemOpts;
	}

	_mouseEnter(element, drag) {
		drag.containers.get(element).inDropZone = true;
		element.addClass(drag.opts.hoverClass);
		element.removeClass(drag.opts.draggingClass);
	}
	_mouseLeave(element, drag) {
		drag.containers.get(element).inDropZone = false;
		element.removeClass(drag.opts.hoverClass);
		element.addClass(drag.opts.draggingClass);
	}
}
