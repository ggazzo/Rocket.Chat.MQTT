import Route from 'route-parser';

export class Router {
	constructor() {
		this.routes = [];
	}
	add(path, cb) {
		this.routes.push([new Route(path), cb])
	}
	async validate(client, sub, models) {
		for (let index = 0; index < routes.length; index++) {
			const [path, method] = routes[index];
			const tmp = path.match(sub.topic);
			if (tmp && (await method(client, sub, tmp, models))) {
				return true;
			}
		}
		return false;
	};
}

const subscriptions = new Router();

subscriptions.add(':uid/subscriptions-changed', (client, sub, { uid }) => uid === client.user._id);
subscriptions.add(':uid/rooms-changed', (client, sub, { uid }) => uid === client.user._id);
subscriptions.add(':uid/notification', (client, sub, { uid }) => uid === client.user._id);
subscriptions.add('permissions-changed', (client) => !!client.user._id);
subscriptions.add(':rid/deleteMessage', (client, sub, { rid }) => !!client.subscriptions[`room-messages/${rid}`]);
subscriptions.add('room-messages/:rid', async ({ user }, sub, { rid }, Services) => Services.call('authorization.canAccessRoom', { rid, uid: user._id }));
subscriptions.add('$SYS/unsubscribe/:id', (uid, { id }) => uid === id);

export default subscriptions;
