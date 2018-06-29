import Router from "route-parser";

const routes = [];

const add = (path, cb) => routes.push([new Router(path), cb]);

add("notify-room/:rid/typing", (client, packet, { rid }, { Subscriptions }) => {
  return !!client.subscriptions[`room-messages/${rid}`];
});

export default async (client, sub, models) => {
  for (let index = 0; index < routes.length; index++) {
    const [path, method] = routes[index];
    const tmp = path.match(sub.topic);
    if (tmp && (await method(client, sub, tmp, models))) {
      return true;
    }
  }
  return false;
};
