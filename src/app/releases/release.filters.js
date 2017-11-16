import { omit } from 'lodash';

/**
 * @ngInject
 */
export function validationStatus() {
	return function(validation, displayName) {
		const name = validation ? validation.status : 'unknown';
		if (displayName) {
			return name[0].toUpperCase() + name.substring(1);
		}
		return name;
	};
}

/**
 * @ngInject
 */
export function validationTooltip() {
	return function(validation) {
		if (!validation) {
			return "This file hasn't been validated yet.";
		}
		switch (validation.status) {
			case 'verified': return 'This file has been validated by a moderator.';
			case 'playable': return 'There are minor problems but the file is still playable.';
			case 'broken': return 'This file has been reported to be broken.';
		}
	};
}

/**
 * @ngInject
 */
export function allowedFlavors() {
	return function(flavors, file) {
		if (file) {
			const ext = file.name.substr(file.name.lastIndexOf('.')).toLowerCase();
			if (ext !== '.vpx') {
				return omit(flavors, 'any');
			}
		}
		return flavors;
	};
}