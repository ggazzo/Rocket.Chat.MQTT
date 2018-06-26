import Router from 'route-parser';

const routes = [];

const add = (path , cb) => routes.push([new Router(path), cb]);

add('room-messages/:rid', async (userId, sub, { rid }, { Subscriptions }) => {
    return !!await Subscriptions.findOne({
        rid,
        'u._id': userId
    }, {
        _id: 1
    });
});

add("$SYS/unsubscribe/:id", async (userId, { id }) => {
    return userId === id;
});

export default async (userId, sub, models) => {
    console.time('authorize');
    return routes.some(async ([path, method]) => {
        const tmp = path.match(sub.topic);
        return tmp && !(await method(userId, sub, tmp, models));
    });
    console.timeEnd("authorize");
}
