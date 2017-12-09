import { isBuffer } from 'util';
import { PNG } from 'pngjs';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toArray = require('stream-to-array');
import { UserHelper } from './UserHelper';
import { User } from './models/user';
import { VpdbConfig } from './models/VpdbConfig';
import Please = require('pleasejs/src/Please.js');

export class Files {

	private storage: AxiosInstance;
	private userHelper: UserHelper;

	constructor(private vpdb: VpdbConfig) {
		this.storage = axios.create({
			baseURL: vpdb.storageUri.protocol + '://' + vpdb.storageUri.hostname + ':' + vpdb.storageUri.port + vpdb.storageUri.pathname
		});
		this.userHelper = new UserHelper(vpdb);
	}

	uploadBackglass(): Promise<File> {
		const color = Please.make_color({ format: 'rgb' })[0];
		const png = new PNG({
			width: 640,
			height: 512,
			colorType: 2,
			bgColor: { red: color.r, green: color.g, blue: color.b }
		});

		let token: string;
		return this.userHelper.getAuthenticatedUser('contributor').then((user: User) => {
			token = user.token;
			return toArray(png.pack());

		}).then(parts => {
			const buffers = parts.map(part => isBuffer(part) ? part : Buffer.from(part));
			const buffer = Buffer.concat(buffers);
			return this.storage.post<File>('/v1/files', buffer, {
				headers: {
					'Content-Type': 'image/png',
					'Content-Disposition': 'attachment; filename="backglass.png"',
					[ this.vpdb.authHeader ]: 'Bearer ' + token,
				},
				params: { type: 'backglass' }
			});
		}).then((response: AxiosResponse) => response.data);
	}
}