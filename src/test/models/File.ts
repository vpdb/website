export interface File {
	created_at: Date,
	mime_type: string,
	file_type: string,
	metadata?: any,
	id: string,
	name: string,
	url: string,
	bytes: number,
	variations?: {
		[key: string]: Url
	},
	is_protected: boolean,
	counter?: {
		[key: string]: number
	}
}

export interface Url {
	url: string,
	is_protected: boolean
}