import AuthenticatedRequest from "./authenticatedRequest";

interface UserRequest extends AuthenticatedRequest {
	user?: any;
}

export default UserRequest;