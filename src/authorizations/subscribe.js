import Router from 'route-parser';

const routes = [];

export const add = (path , cb) => routes.push([new Router(path), cb]);

add(":userId/subscriptions-changed", (client, sub, { userId }) => {
  return userId === client.user._id;
});

add(":userId/rooms-changed", (client, sub, { userId }) => {
  return userId === client.user._id;
});

add(":userId/notification", (client, sub, { userId }) => {
  return userId === client.user._id;
});

add("permissions-changed", client => {
  return !!client.user._id;
});

add(":rid/deleteMessage", (client, sub, { rid }) => {
  return !!client.subscriptions[`room-messages/${rid}`];
});

add('room-messages/:rid', ({user}, sub, { rid }, { Subscriptions }) => {
	return Subscriptions.findOne({ rid, "u._id": user._id }, { _id: 1 });
})

add("$SYS/unsubscribe/:id", (userId, { id }) => {
    return userId === id;
});

export default async (client, sub, models) => {
	for (let index = 0; index < routes.length; index++) {
		const [path, method] = routes[index];
		const tmp = path.match(sub.topic);
		if(tmp && (await method(client, sub, tmp, models))) {
			return true
		}
	}
	return false;
}
