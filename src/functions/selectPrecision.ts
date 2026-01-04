export async function selectPrecision (radius: number) {

  if (radius <= 0.15) return 7;
  if (radius <= 1) return 6;
  if (radius <= 5) return 5;
  if (radius <= 20) return 4;
  if (radius <= 150) return 3;
  if (radius <= 600) return 2;
  if (radius <= 2500) return 1;

  throw new Error("Radius out of range");
};