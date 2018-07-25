import { MongoClient } from 'mongodb';

import { init, connect } from './index';

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'meteor';

const port = process.env.REDIS_PORT || 6379;
const host = process.env.REDIS_HOST || 'localhost';

const config = { port, host };

MongoClient.connect(url,async function(err, client) {
	if (err) process.exit(1);

	const db = client.db(dbName);

	const options = init({
		Subscriptions: db.collection("rock;etchat_subscription")
	});

	connect({
		...options,
		mq: require("mqemitter-redis")(config),
		persistence: require("aedes-persistence-redis")(config)
	});
});
