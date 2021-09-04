import express, { NextFunction, Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import UsersDB from '../db/usersDB';
import AuthenticationHelper from '../helpers/authenticationHelper';
import AuthenticatedRequest from "../interfaces/authenticatedRequest";
import AuthenticationMiddleWare from "../middleware/authenticationMiddleWare";

class Authentication {
	router: Router;
	constructor() {
		this.router = express.Router();
		this.router.post("/", this.authenticate);
		this.router.post("/logout", this.logout);
		this.router.get("/status", AuthenticationMiddleWare(), this.checkAuthenticationStatus);
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

		if (user.password !== password) {
			res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
			return;
		}

		let authToken = await AuthenticationHelper.encryptContent({ userName });

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
}

export default Authentication;
