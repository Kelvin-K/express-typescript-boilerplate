import express, { NextFunction, Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import UsersDB from '../db/usersDB';
import AuthenticationHelper from '../helpers/authenticationHelper';
import AuthenticatedRequest from "../interfaces/authenticatedRequest";
import AuthenticationMiddleWare from "../middleware/authenticationMiddleWare";
import EncryptionHelper from './../helpers/encryptionHelper';
import Validator from './../validator';

class Authentication {
	router: Router;
	constructor() {
		this.router = express.Router();
		this.router.get("/status", AuthenticationMiddleWare(), this.checkAuthenticationStatus);
		this.router.post("/signup", this.signUp);
		this.router.post("/", this.authenticate);
		this.router.post("/logout", this.logout);
	}

	checkAuthenticationStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		let user = UsersDB.getUser(req.userName);
		if (!user) {
			res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
			return;
		}

		res.status(StatusCodes.OK)
			.send({
				firstName: user.firstName,
				lastName: user.lastName
			});
	}

	authenticate = async (req: Request, res: Response, next: NextFunction) => {
		const { userName, password } = req.body;
		let user = UsersDB.getUser(userName);
		if (!user) {
			res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
			return;
		}

		let currentPassword = await EncryptionHelper.decryptContent(user.password, process.env.ENCRYPTION_KEY);
		if (currentPassword !== password) {
			res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
			return;
		}

		let authToken = await AuthenticationHelper.getAuthToken({ userName });
		res.cookie("authToken", authToken, { httpOnly: true, secure: true });
		res.status(StatusCodes.OK)
			.send({
				firstName: user.firstName,
				lastName: user.lastName
			});
	}

	logout = (req: Request, res: Response, next: NextFunction) => {
		res.clearCookie("authToken");
		res.send();
	}

	signUp = async (req: Request, res: Response, next: NextFunction) => {
		let newUser = req.body;
		let userErrors = Validator.validateNewUser(newUser);

		if (Object.keys(userErrors).length) {
			res.status(StatusCodes.BAD_REQUEST).send({
				errorType: "validationError",
				message: userErrors
			});
			return;
		}

		let user = UsersDB.getUser(newUser.userName);
		if (user) {
			res.status(StatusCodes.BAD_REQUEST).send({
				errorType: "userNameError",
				message: "Username already exist!"
			});
			return;
		}

		const { userName, ...userInfo } = newUser;

		userInfo.password = await EncryptionHelper.encryptContent(userInfo.password, process.env.ENCRYPTION_KEY);

		UsersDB.addUser(userName, userInfo);
		res.send();
	}
}

export default Authentication;
