#!/usr/bin/env node

import { $ as zx} from 'zx'
import { exit, env } from 'node:process'

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getFastlyApiKey() {
    let v = zx.verbose;
    zx.verbose = false;
    if (env.FASTLY_API_TOKEN === undefined) {
        try {
            env.FASTLY_API_TOKEN = String(await zx`fastly profile token --quiet`).trim()
        } catch {
            console.error('No environment variable named FASTLY_API_TOKEN has been set and no default fastly profile exists.');
            console.error('In order to run this script, either create a fastly profile using `fastly profile create` or export a fastly token under the name FASTLY_API_TOKEN');
            exit(1)
        }
    }
    zx.verbose = v;
}

async function getOrCreatePolyfillKVStore() {
    let stores = JSON.parse(await zx`fastly kv-store list --json`)

    env.STORE_ID = stores.Data.find(({ Name }) => Name === 'polyfill-library')?.ID
    if (!env.STORE_ID) {
        env.STORE_ID = String(await zx`fastly kv-store create --name "polyfill-library" --json`)
        env.STORE_ID = JSON.parse(env.STORE_ID).ID
    }
}

async function linkKVStoreToServiceAndActivate() {
    let links = JSON.parse(await zx`fastly resource-link list --version latest --json`)
    if (links.some(({resource_id}) => resource_id == env.STORE_ID)){
        return;
    }
    env.VERSION = JSON.parse(String(await zx`fastly resource-link create -r $STORE_ID --version active --autoclone --name=polyfill-library --json`).trim()).version
    await zx`fastly service-version activate --version=$VERSION --quiet --token $FASTLY_API_TOKEN`
}

async function uploadPolyfillsToKVStore() {
    zx.cwd = join(__dirname, 'app/polyfill-libraries/polyfill-library/polyfills/__dist/')
    await zx`fastly kv-store-entry create -s $STORE_ID --dir .`
}

await getFastlyApiKey()
await getOrCreatePolyfillKVStore()
await linkKVStoreToServiceAndActivate()
await uploadPolyfillsToKVStore()
