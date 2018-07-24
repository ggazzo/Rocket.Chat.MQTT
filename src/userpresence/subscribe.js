import { add } from '../authorizations/subscribe';

add('userpresence/:id', async ({ user }, sub, { id }, { Subscriptions }) => {
	// TODO: improve this behavior
	return true;
});
