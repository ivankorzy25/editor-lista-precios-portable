#!/usr/bin/env node

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const ACCESS_TOKEN = 'Dtc8_SXieO8jUv7sbs4Rws5_HHoCHq47';

async function checkRelations() {
    const response = await fetch(`${DIRECTUS_URL}/relations?filter[collection][_eq]=producto_imagenes`, {
        headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const data = await response.json();
    console.log('Relaciones de producto_imagenes:');
    console.log(JSON.stringify(data, null, 2));
}

checkRelations();
