export interface VpdbConfig {
	authHeader:string,
	apiUri: VpdbHostConfig,
	storageUri: VpdbHostConfig,
	webUri: VpdbHostConfig,
	ga: {
		enabled:boolean
	},
	authProviders: {
		local:boolean,
		google:boolean,
		github:boolean,
		ipboard: {
			id:string,
			name:string,
			icon:string,
			url:string,
		}
	},
	documentRevisions: {
		rules:number,
		privacy:number,
		legal:number
	}
}

export interface VpdbHostConfig {
	protocol:string,
	hostname: string,
	port: number,
	pathname?: string
}