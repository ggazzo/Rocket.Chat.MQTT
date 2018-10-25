import { add } from '../Routes/subscribe';

add('notify-room/:rid/typing', (client, sub, { rid }) => !!client.subscriptions[`room-messages/${ rid }`]);
