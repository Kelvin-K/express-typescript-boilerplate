class Validator {

	static validateNewUser = (userInfo: any): { [property: string]: string } => {
		let errors: { [property: string]: string } = {};
		const { userName, password } = userInfo;

		let userError = "";
		if (!userName)
			userError = "Username should not be empty!";
		else if (!/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(userName))
			userError = "Username must be 8 character long and should contain letters, numbers!";

		if (userError)
			errors["userName"] = userError;

		let passwordError = "";
		if (!password)
			passwordError = "Password should not be empty!";
		else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))
			passwordError = "Password must be 8 character long and should include uppercase, lowercase, number and special character!";

		if (passwordError)
			errors["password"] = passwordError;

		return errors;
	}
}

export default Validator;