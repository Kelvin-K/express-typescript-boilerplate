import EncryptionHelper from "./encryptionHelper";

class AuthenticationHelper {

	static getAuthToken = async (content: any) => {
		let newContent = {
			publicKey: process.env.PUBLIC_KEY,
			content: content
		};
		return await EncryptionHelper.encryptContent(newContent, process.env.PRIVATE_KEY);
	}

	static decodeAuthToken = async (token: string) => {
		let decodedToken: any = await EncryptionHelper.decryptContent(token, process.env.PRIVATE_KEY);
		if (!decodedToken || !decodedToken.publicKey || decodedToken.publicKey !== process.env.PUBLIC_KEY)
			throw new Error("Invalid token.");

		return decodedToken.content;
	}
}

export default AuthenticationHelper;