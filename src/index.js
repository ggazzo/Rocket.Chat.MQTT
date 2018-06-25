import assert from 'assert';

import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import aedes from 'aedes';
import net from 'net';

const PORT = 1883;
const url = 'mongodb://localhost:27017';
const dbName = 'meteor';

export function init({ Subscriptions }) {
	const authorizePublish = function(
		client,
		packet,
		callback
	) {
		console.log(packet);
		callback(false, true);
	};

	const authenticate = function(client, username, password, callback) {
		try {
			if (!username || password) {
				return callback(null);
			}
			jwt.verify(username, 'secret', function(err, decoded) {
				client.user = decoded;
				callback(err, !!client.user);
			});
		} catch (error) {
			callback(error);
		}
	};

	const authorizeSubscribe = async function(client, sub, callback) {
		try {
			const { topic: rid } = sub;

			const subscription = await Subscriptions.findOne({
				rid,
				'u._id': client.user._id
			});
			callback(!!subscription, sub);
		} catch (error) {
			console.log(error);
			callback(error);
		}
	};
	return { authorizePublish, authenticate, authorizeSubscribe };
}

export function connect(options) {
	console.log('Connected successfully to server');

	const a = aedes(options);
	const server = net.createServer(a.handle);

	server.listen(PORT, function() {
		console.log('server listening on port', PORT);
	});
}

const buildColletions = function(db) {
	return {
		Subscriptions:{}
	};
};

typeof Meteor !== 'undefined' && MongoClient.connect(url, function(err, client) {
	assert.equal(null, err);
	const options = init(buildColletions(client.db(dbName)));
	connect(options);
});
