import * as jwt from "jsonwebtoken";

class EncryptionHelper {
	static encryptContent = (content: any, secret: string) => {
		return new Promise((resolve, reject) => {
			jwt.sign(
				JSON.stringify(content),
				secret,
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

	static decryptContent = (token: string, secret: string) => {
		return new Promise((resolve, reject) => {
			jwt.verify(
				token,
				secret,
				(err, decoded: jwt.JwtPayload | string) => {
					if (err)
						reject(err);
					else {
						if (typeof decoded === 'string')
							resolve(JSON.parse((decoded as string)));
						else
							resolve(decoded);
					}
				}
			);
		});
	}
}

export default EncryptionHelper;