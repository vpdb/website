import { File } from './File';
import { IpdbGame } from './IpdbGame';

export interface Game extends IpdbGame {
	id: string,
	year: number,
	game_type: "ss" | "em" | "pm" | "na",
	manufacturer: string,
	created_at?: Date,
	rating?: {
		score: number,
		votes: number,
		average: number
	},
	metrics?: {
		popularity: number
	},
	counter?: {
		stars: number,
		comments: number,
		downloads: number,
		views: number,
		releases: number
	},
	pinside?: {
		ranks: number[],
		ids: number[]
	},
	_backglass?: string,
	backglass?: File,
	_logo?: string,
	logo?: File
}