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

export default class EditorCtrl {

	/**
	 * @param $scope
	 * @param $element
	 * @param UserResource
	 * @ngInject
	 */
	constructor($scope, $element, UserResource) {
		this.$scope = $scope;
		this.$element = $element;
		this.UserResource = UserResource;
		this.foundUsers = [];
	}

	textBold() {
		const textarea = this.$element.find('textarea');
		this.apply(textarea, EditorCtrl.wrap(textarea, this.$scope.text, '**'));
	}

	textItalic() {
		const textarea = this.$element.find('textarea');
		this.apply(textarea, EditorCtrl.wrap(textarea, this.$scope.text, '_'));
	}

	textQuote() {
		const textarea = this.$element.find('textarea');
		this.apply(textarea, EditorCtrl.wrapOnNewLine(textarea, this.$scope.text, '> ', /> /));
	}

	textCode() {
		const textarea = this.$element.find('textarea');
		const start = textarea.prop('selectionStart');
		const end = textarea.prop('selectionEnd');
		// if selection has line break, wrap on new line
		if (this.$scope.text && /\n+/.test(this.$scope.text.substring(start, end))) {
			this.apply(textarea, EditorCtrl.wrapOnNewLine(textarea, this.$scope.text, '```\n', /```\n/, '\n```'));
		} else {
			this.apply(textarea, EditorCtrl.wrap(textarea, this.$scope.text, '`'));
		}
	}

	textUnorderedList() {
		const textarea = this.$element.find('textarea');
		this.apply(textarea, EditorCtrl.wrapOnNewLine(textarea, this.$scope.text, '- ', /- /));
	}

	textOrderedList() {
		const textarea = this.$element.find('textarea');
		this.apply(textarea, EditorCtrl.wrapOnNewLine(textarea, this.$scope.text, '\\d. ', /\d+\. /));
	}

	textLink() {
		const textarea = this.$element.find('textarea');
		this.apply(textarea, EditorCtrl.wrapSelect(textarea, this.$scope.text, '[', '](url)', /([^!]|^)(\[([^\]]*)\]\([^)]+\))/, { start: 2, end: 5, replace: 2, keep: 3 }));
	}

	textImage() {
		const textarea = this.$element.find('textarea');
		this.apply(textarea, EditorCtrl.wrapSelect(textarea, this.$scope.text, '![', '](url)', /!(\[([^\]]*)\]\([^)]+\))/, { start: 2, end: 5, replace: 0, keep: 2 }));
	}

	findUser(query) {
		if (query && query.trim().length >= 3) {
			this.UserResource.query({ q: query }, users => {
				this.foundUsers = users;
			});
		} else {
			this.foundUsers = [ null ];
		}
	}

	getUserMention(item) {
		return ~item.name.indexOf(' ') ? '@"' + item.name + '"' : '@' + item.name;
	}

	static matchAll(text, regex) {
		regex = new RegExp(regex.source, 'gi');
		let match;
		const matches = [];
		// eslint-disable-next-line
		while (match = regex.exec(text)) {
			matches.push(match);
		}
		return matches;
	}

	static setSelectionRange(input, selectionStart, selectionEnd) {
		if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		}
		else if (input.createTextRange) {
			const range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		}
	}

	static moveToWordStart(text, start, delimiter) {
		delimiter = delimiter || /^\s$/;
		let b = false;
		for (let n = start; n >= 0; n--) {
			if (delimiter.test(text.substring(n - 1, n))) {
				start = n;
				b = true;
				break;
			}
		}
		if (!b) {
			start = 0;
		}
		return start;
	}

	static moveToWordEnd(text, end, delimiter) {
		delimiter = delimiter || /^\s$/;
		let b = false;
		for (let n = end; n < text.length; n++) {
			if (delimiter.test(text.substring(n, n + 1))) {
				end = n;
				b = true;
				break;
			}
		}
		if (!b) {
			end = text.length;
		}
		return end;
	}

	static wrapSelect(element, text, prefixChars, suffixChars, regex, opts) {
		text = text || '';
		let start = element.prop('selectionStart');
		let end = element.prop('selectionEnd');

		// check if we should remove it
		const matches = EditorCtrl.matchAll(text, regex);
		for (let i = 0; i < matches.length; i++) {
			if (matches[i].index < start && (matches[i].index + matches[i][opts.replace].length) >= end) {
				const index = matches[i].index + matches[i][0].indexOf(matches[i][opts.replace]);
				return {
					text: [text.substring(0, index), matches[i][opts.keep], text.substring(index + matches[i][opts.replace].length)].join(''),
					start: index,
					end: index + matches[i][opts.keep].length
				};
			}
		}

		// check if current word is already wrapped in chars
		if (start === end && end !== text.length) {
			start = EditorCtrl.moveToWordStart(text, start);
			end = EditorCtrl.moveToWordEnd(text, start);
		}

		const block = [text.substring(0, start), prefixChars, text.substring(start, end), suffixChars, text.substring(end)].join('');
		return {
			text: block,
			start: start === end ? start + prefixChars.length : prefixChars.length + end + opts.start,
			end: start === end ? end + prefixChars.length : prefixChars.length + end + opts.end
		};
	}

	static wrap(element, text, chars) {
		text = text || '';
		let start = element.prop('selectionStart');
		let end = element.prop('selectionEnd');
		const selection = start === end ? start : -1;

		// REMOVE
		// ----------------------------------------------------------------
		if (start >= chars.length && text.substring(start - chars.length, start) === chars &&
			text.length >= end + chars.length && text.substring(end, end + chars.length) === chars) {
			return {
				text: [text.slice(0, start - chars.length), text.slice(start, end), text.slice(end + chars.length)].join(''),
				start: start - chars.length,
				end: end - chars.length
			};
		}

		// check if current word is already wrapped in chars
		if (start === end && end !== text.length) {
			start = EditorCtrl.moveToWordStart(text, start);
			end = EditorCtrl.moveToWordEnd(text, start);
		}

		// check again if current selection is already wrapped in chars
		if (text.substring(start, start + chars.length) === chars && text.substring(end - chars.length, end) === chars) {
			return {
				text: [text.slice(0, start), text.slice(start + chars.length, end - chars.length), text.slice(end)].join(''),
				start: (selection < 0 ? start : selection) - chars.length,
				end: (selection < 0 ? end : selection) - chars.length
			};
		}

		// ADD
		// ----------------------------------------------------------------
		return {
			text: [text.slice(0, start), chars, text.slice(start, end), chars, text.slice(end)].join(''),
			start: (selection < 0 ? start : selection) + chars.length,
			end: (selection < 0 ? end : selection) + chars.length
		};
	}

	static wrapOnNewLine(element, text, prefixChars, prefixRegex, suffixChars) {
		suffixChars = suffixChars || '';
		text = text || '';
		let start = element.prop('selectionStart');
		let end = element.prop('selectionEnd');
		const initialStart = start;
		const initialEnd = end;
		let block, selStart, selEnd;

		// trim empty lines
		text = text.replace(/ +\n/g, '\n');
		const lineStart = EditorCtrl.moveToWordStart(text, start, /^\n$/);
		const lineEnd = EditorCtrl.moveToWordEnd(text, end, /^\n$/);
		const numLines = text.slice(start, end).split('\n').length;

		// REMOVE
		// ----------------------------------------------------------------
		if (!suffixChars) {
			const matchPrefix = new RegExp('^' + prefixRegex.source);
			if (matchPrefix.test(text.substring(lineStart))) {
				if (numLines > 1) {
					block = text.slice(lineStart, lineEnd).replace(new RegExp('(\n|^)' + prefixRegex.source, 'g'), '$1');
					return {
						text: [text.slice(0, lineStart), block, text.slice(end)].join(''),
						start: lineStart,
						end: lineStart + block.length
					};
				} else {
					return {
						text: [text.slice(0, lineStart), text.slice(lineStart + prefixChars.length)].join(''),
						start: start - prefixChars.length,
						end: end - prefixChars.length
					};
				}
			}
		} else {
			if (lineStart > prefixChars.length && text.substring(lineStart - prefixChars.length, lineStart) === prefixChars &&
				lineEnd + suffixChars.length <= text.length && text.substring(lineEnd, lineEnd + suffixChars.length) === suffixChars) {
				return {
					text: [text.slice(0, lineStart - prefixChars.length), text.slice(lineStart, lineEnd), text.slice(lineEnd + suffixChars.length)].join(''),
					start: lineStart - prefixChars.length,
					end: lineEnd - prefixChars.length
				};
			}
		}

		// if no selection, expand selection to current word
		if (start === end) {
			start = EditorCtrl.moveToWordStart(text, start);
			end = EditorCtrl.moveToWordEnd(text, start);
		}

		// compute prefix/suffix newlines
		let prefixLF = '';
		let suffixLF = '';
		if (start > 0 && text.substring(start - 1, start) != '\n') {
			prefixLF += '\n';
		}
		if (start > 0 && text.substring(start - 2, start - 1) != '\n') {
			prefixLF += '\n';
		}
		if (end < text.length && text.substring(end, end + 1) != '\n') {
			suffixLF += '\n';
		}
		if (end < text.length && text.substring(end + 1, end + 2) != '\n') {
			suffixLF += '\n';
		}

		// ADD
		// ----------------------------------------------------------------
		if (!suffixChars) {
			// if no suffix chars given, prefix every line.
			block = prefixChars + text.substring(start, end).split('\n').join('\n' + prefixChars);
			let n = 1;
			block = block.replace(/(\\d)/g, function() { return n++; });
			if (numLines > 1) {
				selStart = start + prefixLF.length;
				selEnd = start + prefixLF.length + block.length;
			} else {
				selStart = initialStart + prefixLF.length + prefixChars.length;
				selEnd = initialEnd + prefixLF.length + prefixChars.length;
			}

		} else {
			block = [prefixChars, text.substring(start, end), suffixChars].join('');
			selStart = initialStart + prefixLF.length + prefixChars.length;
			selEnd = selStart + block.length - prefixChars.length - suffixChars.length;
		}
		return {
			text: [text.slice(0, start), prefixLF, block, suffixLF, text.slice(end)].join(''),
			start: selStart,
			end: selEnd
		};
	}

	apply(element, result) {
		this.$scope.text = result.text;
		setTimeout(() => {
			EditorCtrl.setSelectionRange(element[0], result.start, result.end);
		}, 0);
	}
}
