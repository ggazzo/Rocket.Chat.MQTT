import { MongoClient } from 'mongodb';

import { init, connect } from './index';

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'meteor';

MongoClient.connect(url, function(err, client) {
	if (err) process.exit(1);

	const db = client.db(dbName);

	const options = init({
		Subscriptions: db.collection('rocketchat_subscription')
	});
	connect(options);
});
