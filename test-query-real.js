#!/usr/bin/env node

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';

async function test() {
    // La query exacta que usa el script
    const url = `${DIRECTUS_URL}/items/producto_imagenes?filter[producto_id][_eq]=1&fields=*,imagen.*&sort=orden`;

    console.log('Testing URL:', url);
    console.log('');

    const response = await fetch(url);
    console.log('Status:', response.status, response.statusText);
    console.log('');

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
}

test();
