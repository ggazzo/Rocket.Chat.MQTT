import assert from 'assert';
import { MongoClient } from 'mongodb';

import { init, connect } from './index';

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'meteor';

MongoClient.connect(url, function(err, client) {
	assert.equal(null, err);

	const db = client.db(dbName);

	const options = init({
		Subscriptions: db.collection('rocketchat_subscription')
	});
	connect(options);
});
