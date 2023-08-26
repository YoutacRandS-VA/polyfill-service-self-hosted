
# Self-hosted polyfill service

This is a version of Polyfill.io built specifically for hosting within your own Fastly Account.
This version only responds to `/v3/polyfill.js` and `/v3/polyfill.min.js`.

Polyfill.io is a service which makes web development less frustrating by selectively polyfilling just what the browser needs.
Polyfill.io reads the User-Agent header of each request and returns polyfills that are suitable for the requesting browser.

## Deploying

To deploy this project to your fastly account, you need to ru the below commands:
```
npm install
npm run deploy
```

