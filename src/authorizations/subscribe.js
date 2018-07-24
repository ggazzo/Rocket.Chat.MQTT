import Router from 'route-parser';

const routes = [];

<<<<<<< HEAD
export const add = (path , cb) => routes.push([new Router(path), cb]);
=======
const add = (path , cb) => routes.push([new Router(path), cb]);
>>>>>>> d2571e016aaba1405e598d3b1361a885b8d83573

add(":userId/subscriptions-changed", (client, sub, { userId }) => {
  return userId === client.user._id;
});

add(":userId/rooms-changed", (client, sub, { userId }) => {
  return userId === client.user._id;
});

add(":userId/notification", (client, sub, { userId }) => {
  return userId === client.user._id;
});

<<<<<<< HEAD
=======
add('notify-room/:rid/typing', (client, sub, { rid }, { Subscriptions }) => {
	return !!client.subscriptions[`room-messages/${rid}`];
})

>>>>>>> d2571e016aaba1405e598d3b1361a885b8d83573
add("permissions-changed", client => {
  return !!client.user._id;
});

add(":rid/deleteMessage", (client, sub, { rid }) => {
  return !!client.subscriptions[`room-messages/${rid}`];
});

<<<<<<< HEAD
add('room-messages/:rid', ({user}, sub, { rid }, { Subscriptions }) => {
	return Subscriptions.findOne({ rid, "u._id": user._id }, { _id: 1 });
})

add("$SYS/unsubscribe/:id", (userId, { id }) => {
=======
add('room-messages/:rid', async ({user}, sub, { rid }, { Subscriptions }) => {
	return await Subscriptions.findOne({ rid, "u._id": user._id }, { _id: 1 });
})

add("$SYS/unsubscribe/:id", async (userId, { id }) => {
>>>>>>> d2571e016aaba1405e598d3b1361a885b8d83573
    return userId === id;
});

export default async (client, sub, models) => {
	for (let index = 0; index < routes.length; index++) {
		const [path, method] = routes[index];
		const tmp = path.match(sub.topic);
<<<<<<< HEAD
		if(tmp && (await method(client, sub, tmp, models))) {
=======
        if(tmp && (await method(client, sub, tmp, models))) {
>>>>>>> d2571e016aaba1405e598d3b1361a885b8d83573
			return true
		}
	}
	return false;
}
