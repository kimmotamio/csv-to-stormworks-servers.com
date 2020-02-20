const fs = require('fs');
const fetch = require('node-fetch');

let data = fs.readFileSync('data.csv')
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()) // remove white spaces for each line
    .map(e => e.split(',').map(e => e.trim().replace(/"/g, ''))); // split each line to array

postData(data);


function postData(data) {
    // Data is in wireshark CSV format
    const ip = data[0][2];
    const port = data[0][7];

    const { URLSearchParams } = require('url');
 
    const params = new URLSearchParams();
    params.append('ip_address', ip);
    params.append('port', port);
    
    fetch('https://gamedig.api.stormworks-servers.com/servers', { method: 'POST', body: params })
        .then(res => res.json())
        .then(json => {
            console.log(`${ip}:${port}`, json);

            if (data.length > 1) {
                data.shift();
                postData(data);
            }
        });
}
