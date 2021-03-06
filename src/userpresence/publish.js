import { decoder, encoder } from 'rocket.chat.proto';
import Publish from '../Routes/publish';

const decodeUserpresence = decoder('userpresence');
const encodeUserpresence = encoder('userpresence');


const statusAllowed = [0, 1, 2];

Publish.add('userpresence', ({ user }, packet) => {
	if (!user || !user._id) {
		return false;
	}

	const { status, ...args } = decodeUserpresence(packet.payload);

	if (!statusAllowed.includes(status) || Object.keys(args).length) {
		return false;
	}

	packet.qos = 0;
	packet.retain = true;

	packet.payload = encodeUserpresence({ status });

	packet.topic = `userpresence/${ user._id }`;

	return true;
});
