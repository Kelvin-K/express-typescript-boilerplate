import { NextFunction, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import AuthenticationHelper from '../helpers/authenticationHelper';
import AuthenticatedRequest from '../interfaces/authenticatedRequest';

const AuthenticationMiddleWare = () => {
	return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		let cookies = req.cookies;
		if (!cookies || !cookies.authToken) {
			res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
			return;
		}

		let userInfo: any = await AuthenticationHelper.decryptContent(cookies.authToken);
		if (!userInfo) {
			res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
			return;
		}

		req.userName = userInfo.userName;
		next();
	}
}

export default AuthenticationMiddleWare;