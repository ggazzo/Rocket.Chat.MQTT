import Router from 'route-parser';

const routes = [];

export const add = (path , cb) => routes.push([new Router(path), cb]);

add(":uid/subscriptions-changed", (client, sub, { uid }) => {
  return uid === client.user._id;
});

add(":uid/rooms-changed", (client, sub, { uid }) => {
  return uid === client.user._id;
});

add(":uid/notification", (client, sub, { uid }) => {
  return uid === client.user._id;
});

add("permissions-changed", client => {
	return !!client.user._id;
});

add(":rid/deleteMessage", (client, sub, { rid }) => {
	return !!client.subscriptions[`room-messages/${rid}`];
});

add('room-messages/:rid', async ({user}, sub, { rid }, Services) => {
	return Services.call('authorization.canAccessRoom', {rid, uid: user._id})
});

add("$SYS/unsubscribe/:id", (uid, { id }) => {
    return uid === id;
});

export const validate = async (client, sub, Service) => {
	for (let index = 0; index < routes.length; index++) {
		const [path, method] = routes[index];
		const tmp = path.match(sub.topic);

		if (tmp && (await method(client, sub, tmp, Service))) {
			return true
		}
	}
	return false;
}
