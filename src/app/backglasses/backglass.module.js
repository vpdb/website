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
import uiProgressbar from 'angular-ui-bootstrap/src/progressbar';
import uiDatepickerPopup from 'angular-ui-bootstrap/src/datepickerPopup';
import uiTimepicker from 'angular-ui-bootstrap/src/timepicker';
import uiAccordion from 'angular-ui-bootstrap/src/accordion';
import uiTypeahead from 'angular-ui-bootstrap/src/typeahead';
import BackglassDetailsModalCtrl from './backglass.details.modal.ctrl';
import AuthorSelectModule from '../shared/author-select/author.select.module';
import MarkdownModule from '../shared/markdown/markdown.module';

export default angular
	.module('vpdb.backglasses', [ uiProgressbar, uiDatepickerPopup, uiTimepicker, uiAccordion, uiTypeahead, AuthorSelectModule.name, MarkdownModule.name ])
	.controller('BackglassDetailsModalCtrl', BackglassDetailsModalCtrl);
