import { filter, orderBy, flatten, map, keys, values } from 'lodash';

/**
 * The game's details view.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class ReleaseService {

	/**
	 * Class constructor
	 * @param {Flavors} Flavors
	 */
	constructor(Flavors) {
		this.Flavors = Flavors;
	}

	flavorGrid(release) {

		const flavors = orderBy(flatten(map(release.versions, 'files')), 'released_at', true);
		const flavorGrid = {};
		filter(flavors, file => !!file.flavor).forEach(file => {
			const compat = map(file.compatibility, 'id');
			compat.sort();
			let flavor = '';
			keys(file.flavor).sort().forEach(key => {
				flavor += key + ':' + file.flavor[key] + ',';
			});
			let key = compat.join('/') + '-' + flavor;
			const short = file.flavor.orientation === 'any' && file.flavor.lighting === 'any'
				? 'Universal'
				: this.Flavors.orientation.values[file.flavor.orientation].short + ' / ' + this.Flavors.lighting.values[file.flavor.lighting].name;
			flavorGrid[key] = {
				file: file,
				orientation: this.Flavors.orientation.values[file.flavor.orientation],
				lighting: this.Flavors.lighting.values[file.flavor.lighting],
				version: this.getVersion(release, file),
				short: short
			};
		});
		return orderBy(values(flavorGrid), 'released_at', false);
	}

	getVersion(release, file) {
		return filter(release.versions, version => {
			return filter(version.files, f => file.file.id === f.file.id).length > 0;
		})[0];
	}
}