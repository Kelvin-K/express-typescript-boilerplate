import { Request } from 'express';

interface AuthenticatedRequest extends Request {
	userName?: string;
}

export default AuthenticatedRequest;