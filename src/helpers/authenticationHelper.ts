import * as jwt from "jsonwebtoken";

class AuthenticationHelper {
	static encryptContent = (content: any) => {
		let newContent = {
			publicKey: process.env.PUBLIC_KEY,
			content: content
		};
		return new Promise((resolve, reject) => {
			jwt.sign(
				JSON.stringify(newContent),
				process.env.PRIVATE_KEY,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err)
						reject(err);
					else
						resolve(token);
				}
			);
		});
	}

	static decryptContent = (token: string) => {
		return new Promise((resolve, reject) => {
			jwt.verify(
				token,
				process.env.PRIVATE_KEY,
				function (err, decoded) {
					if (err)
						reject(err);
					else {
						if (!decoded || !decoded.publicKey || decoded.publicKey !== process.env.PUBLIC_KEY)
							reject("Invalid token.");
						else
							resolve(decoded.content);
					}
				}
			);
		});
	}
}

export default AuthenticationHelper;