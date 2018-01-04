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

export default class FileUploadHelperService {

	media(type) {
		switch (type) {
			case 'backglass':
				return 'Backglass';
			case 'flyer':
				return 'Flyer';
			case 'instructioncard':
				return 'Instruction Card';
			default:
				return 'Unknown';
		}
	}

	fileIcon(mimeType, isRom) {
		switch (mimeType) {
			case 'application/x-visual-pinball-table':   return 'ext-vpt';
			case 'application/x-visual-pinball-table-x': return 'ext-vpx';
			case 'application/vbscript':                 return 'ext-code';
			case 'application/zip':                      return isRom ? 'ext-rom' : 'ext-zip';
			case 'application/rar':                      return 'ext-zip';
			case 'application/x-rar-compressed':         return 'ext-zip';
			case 'audio/mpeg':                           return 'ext-audio';
			case 'audio/mp3':                            return 'ext-audio';
			case 'image/jpeg':
			case 'image/png':                            return 'ext-image';
			case 'text/plain':                           return 'ext-txt';
			case 'video/mp4':
			case 'video/x-flv':                          return 'ext-video';
			default:                                     return 'ext';
		}
	}

	getMimeType(file) {
		if (file.type) {
			return file.type;
		}
		const ext = file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length).toLowerCase();
		switch (ext) {
			case 'jpg': return 'image/jpeg';
			case 'png': return 'image/png';
			case 'zip': return 'application/zip';
			case 'rar': return 'application/rar';
			case 'vpt': return 'application/x-visual-pinball-table';
			case 'vpx': return 'application/x-visual-pinball-table-x';
			case 'directb2s': return 'application/x-directb2s';
			case 'vbs': return 'application/vbscript';
			case 'mp3': return 'audio/mp3';
			case 'avi': return 'video/avi';
			case 'mp4': return 'video/mp4';
			case 'flv': return 'video/x-flv';
			case 'f4v': return 'video/x-f4v';
			case 'txt': return 'text/plain';
		}
	}

	makeid(len) {

		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < len; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
}