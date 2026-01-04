import path from 'path';
import { Worker } from 'worker_threads';
import { performance } from 'perf_hooks';
import { haversine } from './haversine';
import os from 'os';

type Props = {
  data: {
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  }[]
};

export async function calculateBatchHaversine ({data}: Props) {
  const estimatedTime = shouldUseWorkers(data);

  if (estimatedTime < 40) {
    const distanceData = data.map((item, index) => {
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
      
      const { distance } = haversine({
        lat1: item.lat1,
        lon1: item.lon1,
        lat2: item.lat2,
        lon2: item.lon2
      });

      return {id: index, distance};
    });

    return distanceData;
  };

  const maxWorkers = Math.max(1, os.cpus().length - 1);
  const chunks = chunkArray(data, maxWorkers);

  const results = await Promise.all(
    chunks.map(chunk => {
      const worker = new Worker(path.resolve(__dirname, '../worker/worker.js'));

      worker.postMessage(chunk);

      return new Promise((resolve, reject) => {
        worker.on('message', (results) => {
          resolve(results);
          worker.terminate();
        });

        worker.on('error', (result) => {
          reject(result);
          worker.terminate();
        });
      });
    })
  );

  return results.flat();
};

function shouldUseWorkers (data: any[]) {
  const sampleSize = Math.min(1000, data.length);
  const sample = data.slice(0, sampleSize);

  const start = performance.now();

  for (let i = 0; i < sampleSize; i++) {
    haversine(sample[i]);
  };

  const elapsed= performance.now() - start;

  const estimatedTotalTime = (elapsed / sampleSize) * data.length;

  return estimatedTotalTime;
};

function chunkArray<T> (data: T[], chunk: number) {
  const size = Math.ceil(data.length / chunk);

  const results: T[][] = [];

  for (let i = 0; i < data.length; i += size) {
    results.push(data.slice(i, i + size));
  };
  
  return results;
};