const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.cluster0.oqwbmox.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('Node.js DNS Error:', err.code, err.message);
    return;
  }
  console.log('Node.js found SRV:', addresses);
});