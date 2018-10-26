import Subscriptions from '../Routes/subscribe';

Subscriptions.add('notify-room/:rid/typing', (client, sub, { rid }) => !!client.subscriptions[`room-messages/${ rid }`]);
