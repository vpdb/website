import { isBuffer } from 'util';
import { PNG } from 'pngjs';
import axios, { AxiosInstance } from 'axios';
import toArray = require('stream-to-array');
import { UserHelper } from "./UserHelper";
import { User } from "./models/user";
import { VpdbConfig } from "./models/VpdbConfig";

export class FileHelper {

	private storage: AxiosInstance;
	private userHelper: UserHelper;

	constructor(private vpdb:VpdbConfig) {
		this.storage = axios.create({
			baseURL: vpdb.storageUri.protocol + '://' + vpdb.storageUri.hostname + ':' + vpdb.storageUri.port + vpdb.storageUri.pathname
		});
		this.userHelper = new UserHelper(vpdb);
	}

	uploadBackglass() {
		let png = new PNG({
			width: 640,
			height: 512,
			colorType: 2,
			bgColor: { red: 255, green: 0, blue: 0 }
		});

		let token:string;
		return this.userHelper.getAuthenticatedUser('contributor').then((user:User) => {
			token = user.token;
			return toArray(png.pack());

		}).then(parts => {
			const buffers = parts.map(part => isBuffer(part) ? part : Buffer.from(part));
			const buffer = Buffer.concat(buffers);
			return this.storage.post('/v1/files', buffer, {
				headers: {
					'Content-Type': 'image/png',
					'Content-Disposition': 'attachment; filename="backglass.png"',
					[this.vpdb.authHeader]: 'Bearer ' + token,
				},
				params: { type: 'backglass' }
			});
		});
	}
}