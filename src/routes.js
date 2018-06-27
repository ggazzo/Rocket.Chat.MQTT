import Router from 'route-parser';

const routes = [];

const add = (path , cb) => routes.push([new Router(path), cb]);

// add('room-messages/:rid/typing', async (client, sub, { rid }, { Subscriptions }) => {
// 	sub.topic = sub.topic.replace("room-messages", "notify-room");
// 	return !!client.subscriptions[`room-messages/${rid}`];
// })

add('notify-room/:rid/typing', async (client, sub, { rid }, { Subscriptions }) => {
	return !!client.subscriptions[`room-messages/${rid}`];
})

add('room-messages/:rid', async ({user}, sub, { rid }, { Subscriptions }) => {
	const tmp = await Subscriptions.findOne({ rid, "u._id": user._id }, { _id: 1 });
	return tmp
})

add("$SYS/unsubscribe/:id", async (userId, { id }) => {
    return userId === id;
});

export default async (client, sub, models) => {
	console.time("authorize");
	for (let index = 0; index < routes.length; index++) {
		const [path, method] = routes[index];
		const tmp = path.match(sub.topic);
        if(tmp && (await method(client, sub, tmp, models))) {
			return true
		}
	}
	console.timeEnd("authorize");
	return false;
}
