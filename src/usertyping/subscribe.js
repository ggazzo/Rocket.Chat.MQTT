import { add } from '../Routes/subscribe';

add('notify-room/:rid/typing', (client, sub, { rid }, { Subscriptions }) => {
	return !!client.subscriptions[`room-messages/${rid}`];
})
