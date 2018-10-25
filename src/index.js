import jwt from 'jsonwebtoken';
import aedes from 'aedes';
import net from 'net';
import http from 'http';
import ws from 'websocket-stream';

import './usertyping';
import './userpresence';

const MQTT_PORT = process.env.MQTT_PORT || 1883;
const WS_PORT = process.env.WS_PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

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

	if (process.env.DEBUG || process.env.DEBUG_MQTT){
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
}
