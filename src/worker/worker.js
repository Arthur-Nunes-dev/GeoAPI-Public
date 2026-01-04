const { parentPort } = require('worker_threads');

function haversine ({lat1, lon1, lat2, lon2}) {
  const toRad = (x) => Math.PI * x / 180;

  const R = 6371; // Radius of the Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c  = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const result = R * c;

  return {distance: result};
};

parentPort.on('message', (data) => {
  const results = data.map((item) => {
    if (
      typeof item.lat1 != 'number' ||
      typeof item.lat2 != 'number' ||
      typeof item.lon1 != 'number' ||
      typeof item.lon2 != 'number'
    ) {
      return {
        id: index,
        distance: null,
        Error: 'Invalid number in latitude or longitude value'
      };
    };

    if (
      item.lat1 < -90 || item.lat1 > 90 ||
      item.lat2 < -90 || item.lat2 > 90 ||
      item.lon1 < -180 || item.lon1 > 180 ||
      item.lon2 < -180 || item.lon2 > 180
    ) {
      return {
        id: index,
        distance: null,
        Error: 'Coordinates must be between -90 and 90 for lat and -180 and 180 for lon'
      };
    };

    return haversine({
      lat1: item.lat1,
      lon1: item.lon1,
      lat2: item.lat2,
      lon2: item.lon2
    });
  });
  
  parentPort.postMessage(results);
});