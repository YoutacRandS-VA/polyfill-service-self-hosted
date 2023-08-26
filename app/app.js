// @ts-check
/// <reference types="@fastly/js-compute" />

import { Hono } from 'hono/quick'
import { cors } from 'hono/cors'
import { logger } from './logger.js'
import { polyfillHandler } from './polyfill-handler.js';

export const app = new Hono()

app.onError((error, c) => {
	console.error('Internal App Error:', error, error.stack, error.message);
	return c.text('Internal Server Error', 500)
});

app.use('*', logger());

app.use('*', cors())

app.get("/v3/polyfill.js", polyfillHandler);
app.get("/v3/polyfill.min.js", polyfillHandler);

app.notFound((c) => {
	c.res.headers.set("Cache-Control", "public, s-maxage=31536000, max-age=604800, stale-while-revalidate=604800, stale-if-error=604800, immutable");
	return c.text('Not Found', 404)
})
