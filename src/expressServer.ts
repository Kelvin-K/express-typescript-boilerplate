import express, { Express } from "express";
import LoggingMiddleWare from "./middleware/loggingMiddleWare";
import Authentication from './routes/authentication';
import HealthCheck from './routes/healthCheck';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');

class ExpressServer {

	app: Express;

	constructor() {
		this.app = express();
		this.configureMiddleware();
		this.configureRoutes();
	}

	configureMiddleware = () => {
		// parse application/x-www-form-urlencoded
		this.app.use(bodyParser.urlencoded({ extended: false }));

		// parse application/json
		this.app.use(bodyParser.json());

		// parse cookies		
		this.app.use(cookieParser());

		// cors		
		this.app.use(cors());

		// Log requests for auditing purpose
		this.app.use(LoggingMiddleWare());
	}

	configureRoutes = () => {
		this.app.use("/", new HealthCheck().router);
		this.app.use("/authentication", new Authentication().router);
	}

	start = (port: any) => {
		this.app.listen(port, () => {
			console.log(`Server started listening at http://localhost:${port}/`);
		});
	}
}

export default ExpressServer;