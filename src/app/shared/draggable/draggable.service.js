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

import angular from 'angular';

/**
 * The service bridging draggable-container and draggable-item.
 *
 * The drag and drop feature uses Draggabilly for the drag feature and a custom
 * AngularJS binding.
 *
 * @see <a href="https://draggabilly.desandro.com/">Draggabilly</a>
 * @author freezy <freezy@vpdb.io>
 */
export default class DraggableService {

	/**
	 * @ngInject
	 */
	constructor($document) {

		this.$document = $document;

		/**
		 * Drag setup as defined through drag and drop directives
		 * @type {{ [string]: { containers:Map.<JQLite, { inDropZone:boolean }> }}}
		 */
		this.drags = {};
	}

	/**
	 * Initializes a container when the container directive is linked.
	 *
	 * @param {string} dragId Drag ID
	 * @param {JQLite} element Drag container
	 * @param {{draggingClass:string, hoverClass:string}} opts Options
	 */
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

	/**
	 * Sets up the mouse events and item data when and item starts dragging.
	 *
	 * @param {string} dragId Drag ID
	 * @param {JQLite} element
	 * @param {{animateDuration:number, data:*}} opts
	 */
	startDrag(dragId, element, opts) {
		if (this.drags[dragId] && this.drags[dragId].containers) {
			for (let element of this.drags[dragId].containers.keys()) {
				element.addClass(this.drags[dragId].opts.draggingClass);
			}
			this.drags[dragId].item = element;
			this.drags[dragId].itemOpts = opts;
		}
	}

	/**
	 * Triggered when dragging moves.
	 *
	 * @param {string} dragId Drag ID
	 * @param {{ pageX:number and pageY:number }} pointer Pointer coordinates
	 */
	moveDrag(dragId, pointer) {
		const drag = this.drags[dragId];
		if (drag && drag.containers) {
			for (let element of drag.containers.keys()) {
				const inDropZoneBefore = drag.containers.get(element).inDropZone;
				const inDropZoneNow = this._inDropZone(element, pointer.pageX, pointer.pageY);
				if (inDropZoneNow && inDropZoneBefore === inDropZoneNow) {
					element.addClass(drag.opts.hoverClass);
				}
				if (!inDropZoneNow && inDropZoneBefore === inDropZoneNow) {
					element.removeClass(drag.opts.hoverClass);
				}
				drag.containers.get(element).inDropZone = inDropZoneNow;
			}
		}
	}

	/**
	 * Executes the action when the item is dropped into a container.
	 *
	 * @param {string} dragId Drag ID
	 * @param {JQLite} itemElement Dropped item
	 */
	stopDrag(dragId, itemElement) {
		let dropContainer = null;
		const drag = this.drags[dragId];
		for (let element of drag.containers.keys()) {

			// clean classes and set drop element if in zone
			if (drag.containers.get(element).inDropZone) {
				dropContainer = element;
				element.removeClass(drag.opts.hoverClass);
			}
			element.removeClass(drag.opts.draggingClass);
			drag.containers.get(element).inDropZone = false;
		}

		// on hit, execute action
		if (dropContainer) {
			angular.element(dropContainer).scope().$broadcast(dragId + '-dropped', drag.itemOpts.data);

		} else {
			// otherwise, animate back
			if (drag.itemOpts.animateDuration) {
				const opts = drag.itemOpts;
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
				itemElement.css({ transition: '', top: '', left: '' });
			}
		}

		// clean up item
		delete drag.item;
		delete drag.itemOpts;
	}

	/**
	 * Checks whether mouse coordinates are in a drop container.
	 *
	 * @param {JQLite} element Container element
	 * @param {number} x Absolute x-coordinate
	 * @param {number} y Absolute y-coordinates
	 * @returns {boolean} True if coordinates are within the container or false otherwise.
	 * @private
	 */
	_inDropZone(element, x, y) {
		let bounds = element[0].getBoundingClientRect();
		x -= this.$document[0].body.scrollLeft + this.$document[0].documentElement.scrollLeft;
		y -= this.$document[0].body.scrollTop + this.$document[0].documentElement.scrollTop;
		return  x >= bounds.left
			&& x <= bounds.right
			&& y <= bounds.bottom
			&& y >= bounds.top;
	}
}
