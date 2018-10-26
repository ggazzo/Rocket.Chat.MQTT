import Route from 'route-parser';
export class Router {
	constructor() {
		this.routes = [];
	}
	add(path, cb) {
		this.routes.push([new Route(path), cb]);
	}
	async validate(client, sub, models) {
		const { routes } = this;
		for (let index = 0; index < routes.length; index++) {
			const [path, method] = routes[index];
			const tmp = path.match(sub.topic);
			if (tmp && (await method(client, sub, tmp, models))) {
				return true;
			}
		}
		return false;
	}
}
export default new Router();
