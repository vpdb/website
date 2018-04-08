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

import LightboxTpl from './lightbox.template.pug';

/**
 * @param LightboxProvider
 * @ngInject
 */
export default function(LightboxProvider) {
	LightboxProvider.templateUrl = LightboxTpl;

	/**
	 * Calculate the max and min limits to the width and height of the displayed
	 * image (all are optional). The max dimensions override the min
	 * dimensions if they conflict.
	 *
	 * @param    {Object} dimensions Contains the properties `windowWidth`, `windowHeight`, `imageWidth`, and `imageHeight`.
	 * @return   {Object} May optionally contain the properties `minWidth`, `minHeight`, `maxWidth`, and `maxHeight`.
	 * @type     {Function}
	 * @name     calculateImageDimensionLimits
	 * @memberOf bootstrapLightbox.Lightbox
	 */
	LightboxProvider.calculateImageDimensionLimits = function(dimensions) {
		if (dimensions.windowWidth >= 768) {
			return {
				// 92px = 2 * (30px margin of .modal-dialog
				//             + 1px border of .modal-content
				//             + 5px padding of .modal-body)
				// with the goal of 30px side margins; however, the actual side margins
				// will be slightly less (at 22.5px) due to the vertical scrollbar
				maxWidth: dimensions.windowWidth - 92,
				// 126px = 92px as above
				//         + 34px outer height of .lightbox-nav
				maxHeight: dimensions.windowHeight - 126
			};
		} else {
			return {
				// 52px = 2 * (10px margin of .modal-dialog
				//             + 1px border of .modal-content
				//             + 5px padding of .modal-body)
				maxWidth: dimensions.windowWidth - 32,
				// 86px = 52px as above
				//        + 34px outer height of .lightbox-nav
				maxHeight: dimensions.windowHeight - 86
			};
		}
	};

	/**
	 * Calculate the width and height of the modal. This method gets called
	 * after the width and height of the image, as displayed inside the modal,
	 * are calculated.
	 *
	 * @param    {Object} dimensions Contains the properties `windowWidth`, `windowHeight`, `imageDisplayWidth`, and `imageDisplayHeight`.
	 * @return   {Object} Must contain the properties `width` and `height`.
	 * @type     {Function}
	 * @name     calculateModalDimensions
	 * @memberOf bootstrapLightbox.Lightbox
	 */
	LightboxProvider.calculateModalDimensions = function(dimensions) {
		// 400px = arbitrary min width
		// 32px = 2 * (1px border of .modal-content
		//             + 15px padding of .modal-body)
		let width = Math.max(400, dimensions.imageDisplayWidth + 12);

		// 200px = arbitrary min height
		// 66px = 32px as above
		//        + 34px outer height of .lightbox-nav
		let height = Math.max(200, dimensions.imageDisplayHeight + 60);

		// first case:  the modal width cannot be larger than the window width
		//              20px = arbitrary value larger than the vertical scrollbar
		//                     width in order to avoid having a horizontal scrollbar
		// second case: Bootstrap modals are not centered below 768px
		if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
			width = 'auto';
		}

		// the modal height cannot be larger than the window height
		if (height >= dimensions.windowHeight) {
			height = 'auto';
		}
		return {
			width: width,
			height: height
		};
	};
}