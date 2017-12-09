export interface IpdbGame {
	ipdb: {
		number: number,
		mfg?: number,
		rating?: string,
		mpu?: number
	},
	title: string,
	year: number
	manufacturer?: string,
	model_number?: string,
	game_type?: "ss" | "em" | "pm",
	short?: string[],
	produced_units?: number,
	themes?: string[],
	designers?: string[],
	artists?: string[],
	features?: string,
	notes?: string,
	toys?: string,
	slogans?: string
}