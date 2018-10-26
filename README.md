# Rocket.Chat.Streamer

It's a MQTT Server, using redis to scale horizontally.

You can run a stand alone server, or embed on your server.



### Variables
 - REDIS_PORT default(6379)
 - REDIS_HOST default(localhost)
 - METRICS defalt(false)
 - MQTT_PORT default(1883);
 - WS_PORT default(8080);
### Standalone version
```bash
	node server.js
```
```bash
	rocketchat-streamer
```
### Embedded version
```javascript
import * as Server from 'rocket.chat.mqtt' ;

await Server.start(); // Promise

```
