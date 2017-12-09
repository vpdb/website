import { resolve } from 'path';
import axios, { AxiosInstance } from 'axios';
import { clone } from 'lodash';
import { VpdbConfig } from '../models/VpdbConfig';
import { IpdbGame } from '../models/IpdbGame';

export class Games {

	private api: AxiosInstance;
	static IPDB: IpdbGame[] = require(resolve(__dirname, '../../../../src/test/ipdb.json')); // path relative to compiled file

	constructor(private vpdb: VpdbConfig) {
		this.api = axios.create({
			baseURL: vpdb.apiUri.protocol + '://' + vpdb.apiUri.hostname + ':' + vpdb.apiUri.port + vpdb.apiUri.pathname
		});
	}

	public static popGame():IpdbGame {
		return Games.IPDB.splice(Games.randomInt(Games.IPDB.length), 1)[0]
	}

	public static randomInt(max) {
		return Math.floor(Math.random() * max - 1) + 1;
	}
}