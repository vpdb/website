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

/**
 * Defines a drop zone.
 *
 * Attributes:
 *    - draggable-container: The drag ID. Only items with the same draggable-item
 *      can be dropped.
 *    - draggable-dragging-class: Added when an item is being dragged.
 *    - draggable-hover-class: Added when an item is being dragged over this
 *      container.
 *    - draggable-on-drop: An action executed when an item is dropped into the
 *      container. Use $data for the item's draggable-data value.
 *
 * @ngInject
 */
export default function($parse, DraggableService) {
	return {
		restrict: 'A',
		scope: {
			draggableOnDrop: '&',
		},
		link: function(scope, element, attrs) {
			DraggableService.addContainer(attrs['draggableContainer'], element, {
				draggingClass: attrs['draggableDraggingClass'] || 'draggable-dragging',
				hoverClass: attrs['draggableHoverClass'] || 'draggable-hovering'
			});
			scope.$on(attrs['draggableContainer'] + '-dropped', (event, data) => {
				scope.draggableOnDrop({ $data: data });
				scope.$apply();
			});
		}
	};
}
