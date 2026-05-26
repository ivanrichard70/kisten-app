const { execSync } = require('child_process');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id) {
    return { statusCode: 400, body: 'Missing id parameter' };
  }

  try {
    // Use qrcode npm package
    const QRCode = require('qrcode');
    const dataUrl = await QRCode.toDataURL(id, {
      width: 200,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });
    
    // Return as JSON with data URL
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400'
      },
      body: JSON.stringify({ dataUrl })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
