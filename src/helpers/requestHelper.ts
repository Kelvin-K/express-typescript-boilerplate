class RequestHelper {
	static get_cookies = (request: any) => {
		var cookies: any = {};
		request.headers && request.headers.cookie.split(';').forEach(function (cookie: any) {
			var parts = cookie.match(/(.*?)=(.*)$/)
			cookies[parts[1].trim()] = (parts[2] || '').trim();
		});
		return cookies;
	};
}

export default RequestHelper;