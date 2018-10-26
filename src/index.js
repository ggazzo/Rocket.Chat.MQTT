import { ServiceBroker } from 'moleculer';

const metrics = process.env.METRICS || false;

const Services = new ServiceBroker({
	logLevel: 'info',
	sampleCount: 1,
	namespace: 'services',
	metrics,
	transporter: 'TCP',
	cacher: 'Memory',
});

import * as MqttServer from './server';
import * as Routes from './Routes';

const port = process.env.REDIS_PORT || 6379;
const host = process.env.REDIS_HOST || 'localhost';

const config = { port, host };

export const start = () =>
	Services.start()
	// .then(() => Services.waitForServices(['authentication', 'authorization']))
		.then(() => {
			MqttServer.connect({
				async authorizeSubscribe(client, sub, callback) {
					try {
						// const { topic } = sub;
						if (!(await Routes.Subscriptions.validate(client, sub, Services))) {
							throw 'not authorized';
						}
						return callback(null, sub);
					} catch (error) {
						console.log(error);
						callback(error);
					}
				},
				async authorizePublish(/* client, packet, callback*/) {
					return false;
				},
				async authenticate(client, username, password, callback) {
					try {
						const user = await Services.call('authentication.login', { username, password });
						if (user) {
							client.user = user;
							client.user._id = 'rocket.cat';
							return callback(false, !!user);
						}
						// jwt.verify(username, JWT_SECRET, function (err, decoded) {
						// 	// console.log('decoded ->', decoded);
						// 	callback(err, !!client.user);
						// });
						callback(true);
					} catch (error) {
						console.log(error);
						callback(error);
					}
				},
				mq: require('mqemitter-redis')(config),
				persistence: require('aedes-persistence-redis')(config),
			});
		});
if (require.main === module) { // standalone
	start();
}
