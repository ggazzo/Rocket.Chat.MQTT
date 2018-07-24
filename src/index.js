import jwt from 'jsonwebtoken';
import aedes from 'aedes';
import net from 'net';
import http from 'http';
import ws from 'websocket-stream';

import subscriptionRoutes from './authorizations/subscribe';
import publishRoutes from './authorizations/publish';

import './usertyping';
import './userpresence';

const MQTT_PORT = process.env.MQTT_PORT || 1883;
const WS_PORT = process.env.WS_PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function init(models) {
	const authorizePublish = async function(
		client,
		packet,
		callback
	) {
		try {
			const authorized = await publishRoutes(client, packet, models);
			if (!authorized) {
				throw 'not authorized';
			}
			return callback(null);
		} catch (error) {
			if (!error.returnCode) {
				error.returnCode = 4;
			}

			console.log(error);
			callback(error);
		}
	};

	const authenticate = function(client, username, password, callback) {
		try {
			if (!username || password.toString()) {
				return callback(null);
			}
			jwt.verify(username, JWT_SECRET, function(err, decoded) {
				// console.log('decoded ->', decoded);
				client.user = decoded;
				callback(err, !!client.user);
			});
		} catch (error) {
			callback(error);
		}
	};

	const authorizeSubscribe = async function(client, sub, callback) {
		try {
			// const { topic } = sub;
			const authorized = await subscriptionRoutes(client, sub, models);
			if (!authorized) {
				throw 'not authorized';
			}
			return callback(null, sub);
		} catch (error) {
			console.log(error);
			callback(error);
		}
	};
	return { authorizePublish, authenticate, authorizeSubscribe };
}

export function connect(options) {
	const a = aedes({
		...options
	});

	const mqtt = net.createServer(a.handle);

	mqtt.listen(MQTT_PORT, function() {
		console.log('mqtt server listening on port', MQTT_PORT);
	});

	const httpServer = http.createServer();

	ws.createServer({
		server: httpServer
	}, a.handle)

	httpServer.listen(WS_PORT, function() {
		console.log('ws server listening on port', WS_PORT);
	});

	a.on('clientError', function(client, err) {
		console.log('client error', client.id, err.message);
	});

	a.on('publish', function(packet, client) {
		if (client) {
			console.log('message from client', client.id);
		}
	});

	a.on('client', function(client) {
		console.log('new client', client.id);
	});
}
