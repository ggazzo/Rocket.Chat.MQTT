import { ServiceBroker } from 'moleculer';

const metrics = process.env.METRICS || false;

import * as MqttServer from './server';
import * as Routes from './Routes';

const port = process.env.REDIS_PORT || 6379;
const host = process.env.REDIS_HOST || 'localhost';

const config = { port, host };

export const createService = ({ mq }) => new ServiceBroker({
	logLevel: 'info',
	sampleCount: 1,
	namespace: 'services',
	metrics,
	transporter: 'TCP',
	cacher: 'Memory',
	started(Services) {
		MqttServer.connect({
			async authorizeSubscribe(client, sub, callback) {
				try {
					// const { topic } = sub;
					if (!(await Routes.Subscriptions.validate(client, sub, Services))) {
						throw 'not authorized';
					}
					return callback(null, sub);
				} catch (error) {
					Services.logger.log(error);
					callback(error);
				}
			},
			async authorizePublish(/* client, packet, callback*/) {
				return false;
			},
			async authenticate(client, username, password, callback) {
				try {
					// AnonymousRead
					if (!password && username === 'anonymous') {
						if (await Services.call('settings.get', { name: 'Accounts_AllowAnonymousRead' })) {
							client.user = { };
							callback(null, {});
						}

						return callback(true);
					}

					// LiveChat
					if (username === 'livechat-guest') {
						if (await Services.call('settings.get', { name: 'Livechat_enabled' })) {
							const user = await Services.call('authentication.loginJWT', { token : password });
							client.user = user;
							callback(null, {});
						}

						return callback(true);
					}

					// Users
					const user = await Services.call('authentication.login', { username, password: password.toString('utf8') });
					if (user) {
						client.user = user;
						return callback(false, !!user);
					}

					callback(true);
				} catch (error) {
					Services.logger.log(error);
					callback(error);
				}
			},
			mq: mq || require('mqemitter-redis')(config),
			persistence: require('aedes-persistence-redis')(config),
		});
	},
});
if (require.main === module) { // standalone
	createService().start();
}
