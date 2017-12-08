export interface User {
	id?: string,
	username: string,
	password: string,
	name?: string,
	roles?: string[],
	email?: string,
	token?: string,
	_plan?: string
	is_active?: boolean
}