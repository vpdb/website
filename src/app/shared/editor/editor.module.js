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
import uiTooltip from 'angular-ui-bootstrap/src/tooltip';
import uiTabs from 'angular-ui-bootstrap/src/tabs';
import 'ment.io';
import ngElastic from 'angular-elastic';

import editor from './editor.directive';
import editorMarkdownInfo from './editor.markdown-info.directive';
import EditorDirectiveCtrl from './editor.directive.ctrl';
import MarkdownModule from '../markdown/markdown.module';
import msdElasticConfig from './msd-elastic.config';

export default angular
	.module('vpdb.editor', [ uiTooltip, uiTabs, MarkdownModule.name, ngElastic, 'mentio' ])
	.controller('EditorDirectiveCtrl', EditorDirectiveCtrl)
	.directive('editor', editor)
	.directive('markdownInfo', editorMarkdownInfo)
	.config(msdElasticConfig);
