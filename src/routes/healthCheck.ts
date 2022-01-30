import express, { NextFunction, Request, Response, Router } from "express";

class HealthCheck {

	router: Router;

	constructor() {
		this.router = express.Router();
		this.router.get("/", this.getHealthCheck);
	}

	getHealthCheck = (req: Request, res: Response, next: NextFunction) => {
		res.status(200).send("express-typescript-boilerplate node is healthy.");
	}
}

export default HealthCheck;