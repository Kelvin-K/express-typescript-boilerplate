import db from './db';

class UsersDB {
	static getUser = (userName: string) => {
		let user;
		try { user = db.getData(`/users/${userName}`); } catch { }
		return user;
	}

	static addUser = (userName: string, userInfo: any) => {
		db.push(`/users/${userName}`, userInfo);
	}
}

export default UsersDB;