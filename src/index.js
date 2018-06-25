import jwt from 'jsonwebtoken';
import aedes from 'aedes';
import net from 'net';

const PORT = process.env.MQTT_PORT || 1883;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

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
			jwt.verify(username, JWT_SECRET, function(err, decoded) {
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
			}, {
				_id: 1
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
	const a = aedes({
		mq: require('mqemitter-redis')(),
		persistence: require('aedes-persistence-redis')(),
		...options
	});

	const server = net.createServer(a.handle);
	server.listen(PORT, function() {
		console.log('server listening on port', PORT);
	});

	aedes.on('clientError', function(client, err) {
		console.log('client error', client.id, err.message);
	});

	aedes.on('publish', function(packet, client) {
		if (client) {
			console.log('message from client', client.id);
		}
	});

	aedes.on('client', function(client) {
		console.log('new client', client.id);
	});
}
