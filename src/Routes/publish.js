import Router from 'route-parser';

const routes = [];

export const add = (path, cb) => routes.push([new Router(path), cb]);

export const validate = async(client, sub, models) => {
	for (let index = 0; index < routes.length; index++) {
		const [path, method] = routes[index];
		const tmp = path.match(sub.topic);
		if (tmp && (await method(client, sub, tmp, models))) {
			return true;
		}
	}
	return false;
};
