import db from './db';

class UsersDB {
	static getUser = (username: string) => {
		let user;
		try {
			user = db.getData(`/users/${username}`);
		}
		catch
		{
		}
		return user;
	}
}

export default UsersDB;