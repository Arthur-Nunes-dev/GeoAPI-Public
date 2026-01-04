interface Props {
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
};

export function haversine ({lat1, lon1, lat2, lon2}: Props) {
  const toRad = (x: number) => Math.PI * x / 180;

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