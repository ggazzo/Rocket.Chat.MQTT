import { decoder, encoder } from 'rocket.chat.proto';

import { add } from '../Routes/publish';

const decodeTyping = decoder('typing');
const encodeTyping = encoder('typing');

add('notify-room/:rid/typing', (client, packet, { rid }) => {
	const { user } = client;

	if (!user || !user._id) {
		return false;
	}

	if (!client.subscriptions[`room-messages/${ rid }`]) {
		return false;
	}

	const [status, ...args] = decodeTyping(packet.payload);

	if (typeof (status) === typeof (true) || args.length) {
		return false;
	}

	packet.qos = 0;
	packet.retain = false;

	packet.payload = encodeTyping({ status, _id: user._id });

	return true;
});
