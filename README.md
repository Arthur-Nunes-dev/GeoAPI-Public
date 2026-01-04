
**GeoApi** is a small REST API written in **TypeScript/Node.js** that provides geospatial utilities: distance calculation (Haversine), batch distance processing (with optional worker threads), and geohash creation/search backed by Supabase (Postgres).

If you don't want the implementation work, we offer a pay-per-use option.

Access the following URL for more information:
https://rapidapi.com/ArthurNunesdev/api/geoapi24

---
## Overview

GeoApi exposes simple endpoints to calculate distances between two coordinates, to calculate distances for large batches (with an automatic decision to use worker threads for heavy loads), and to store/query locations using geohashes for efficient radius search. It's designed for developers who need fast geospatial utilities as a service.

---
## Technologies

- Node.js
- TypeScript
- Express
- Supabase (Postgres)
- Worker Threads (for batch processing)
- ngeohash

---
## Prerequisites

- Node.js (>= 18 recommended)

- npm or yarn

- A Supabase project (or compatible Postgres DB)

- Environment variables set (see below)

Environment variables (required):

- `SUPABASE_URL` — your Supabase URL
- `SUPABASE_ANON_KEY` — public anon key for Supabase
- `PORT` — optional (defaults handled by environment when not set)

> The app will throw an error at startup if `SUPABASE_URL` or `SUPABASE_ANON_KEY` are missing.

---
## Installation & Run (local)

1. Clone the repository

```bash

git clone <repo-url>

cd GeoApi

```

2. Install dependencies

```bash

npm install

```

3. Create a `.env` file with the required variables (see Prerequisites)

4. Run in development
  
```bash

npm run dev

```

5. Build & start for production

```bash

npm run start

```

The server mounts the API at `/api` (for example, `http://localhost:PORT/api/basicHarversine`).

---  
## CORS

- CORS allows `http://localhost:3000`, `https://you-url.com` by default.

```TS
const allowedOrigins = [
	`http://localhost:${process.env.PORT}`,
	`https://you-url-server.com`
];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Blocked by CORS policy"));
		};
	};
}));
```

---
## Endpoints

Base path: `/api`
### POST /api/basicHarversine

Calculate the Haversine distance between two points.
  
Request body (JSON):

```json
{
	"data": {
		"from": { "lat": 12.34, "lon": -56.78 },
		"to": { "lat": 23.45, "lon": -67.89 }
	}
}
```

Response (200):

```json
{ "distance": 123.456 }
```
  
Validation:

- Coordinates must be numbers and within valid ranges (lat: -90..90, lon: -180..180).

Rate limit: 60 requests per minute.

---
### POST /api/batchHarversine

Batch distance calculation for an array of coordinate pairs.

Request body (JSON):

```json
{
	"data": [
		{ "lat1": 1, "lon1": 2, "lat2": 3, "lon2": 4 },
		{ "lat1": 5, "lon1": 6, "lat2": 7, "lon2": 8 }
	]
}
```
  
Response (200):

```json
{ 
	"results": [ 
		{ "id": 0, "distance": 123 },
		{ "id": 1, "distance": 456 }
	]
}
```

Notes:

- The service will run a small sample benchmark and choose to use worker threads when the estimated total time crosses a threshold.

- Max number of elements enforced by validation: 25.

Rate limit: 10 requests per minute.

---
### POST /api/geoHash

Store a location and its geohashes (several precisions are stored).

Request body (JSON):

```json
{ 
	"data": {
		"lat": 12.34,
		"lon": -56.78,
		"name": "My Place"
	}
}
```

Response (201):

- Success returns a status text from Supabase insert (usually `"OK"` or insert metadata).

Validation:

- lat/lon must be numbers and within valid ranges

- name must be a string

Rate limit: 20 requests per minute.  

Database table expected: `geohashs` with columns at least:

- `id`, `latitude`, `longitude`, `geohash`, `gh6`, `gh5`, `gh4`, `gh3`, `gh2`, `gh1`, `locateName`

Sample SQL:

```sql
CREATE TABLE geohashs (
	id serial PRIMARY KEY,
	
	latitude numeric NOT NULL,
	
	longitude numeric NOT NULL,
	
	geohash text NOT NULL,
	
	gh6 text,
	
	gh5 text,
	
	gh4 text,
	
	gh3 text,
	
	gh2 text,
	
	gh1 text,
	
	locateName text
);
```

---
### GET /api/geoHash?lat=<lat>&lon=<lon>&radius=<meters>

Find stored locations within `radius` meters from the given point.

Example:

```textt
GET /api/geoHash?lat=12.34&lon=-56.78&radius=500
```

Response (200):

```json

[
	{ 
		"id": 1,
		"locateName": "My Place",
		"latitude": "12.341",
		"longitude": "-56.78",
		"geoHash": "…",
		"distance": 123 
	}
]

```

  

Notes:

- The service computes the appropriate geohash precision for the requested radius, queries neighbors, then filters by exact distance (Haversine).

- `radius` must be a positive number.

Rate limit: 60 requests per minute.

---

## Examples

### curl: basicHaversine

```bash

curl -X POST http://localhost:3000/api/basicHarversine \

-H "Content-Type: application/json" \

-d '{"data":{"from":{"lat":12,"lon":-40},"to":{"lat":-5,"lon":30}}}'

```
### curl: batchHarversine

```bash

curl -X POST http://localhost:3000/api/batchHarversine \

-H "Content-Type: application/json" \

-d '{"data":[{"lat1":1,"lon1":2,"lat2":3,"lon2":4}]}'

```

### curl: geoHash store

```bash

curl -X POST http://localhost:3000/api/geoHash \

-H "Content-Type: application/json" \

-d '{"data":{"lat":12.34,"lon":-56.78,"name":"Place"}}'

```

### curl: geoHash search

```bash

curl "http://localhost:3000/api/geoHash?lat=12.34&lon=-56.78&radius=500" \

-H "X-RapidAPI-Host: demo"

```

---

## ❗ Common Errors & Troubleshooting

- `Error: This variables SUPABASE_URL and SUPABASE_ANON_KEY must be defined.` → Ensure `.env` contains `SUPABASE_URL` and `SUPABASE_ANON_KEY` and restart.

- Validation errors (400 range in middleware) → Check request body shapes and ranges (lat/lon ranges, required `data` key, non-empty arrays for batch).

- Database insert/select errors → Verify Supabase table `geohashs` exists and the anon key has write/read permissions.

- Batch takes long / CPU heavy → The app will use worker threads for large batches, but watch memory and CPU limits in your environment; tune chunking logic if necessary.

---

## Contributing

- Follow standard PR flow: fork, branch, open PR with description and tests where applicable.

- Run `npm run build` to ensure TypeScript compiles.

- Add unit tests where applicable (not included in repository by default).

---

##  Next Steps  & Ideas

- Add integration/unit tests for critical flows

- Add OpenAPI / Swagger documentation for the API

- Add CI checks (type-check, lint, tests)

- Add Dockerfile and a simple reproducible local environment

---

## Contact

If you have questions or want help improving docs, open an issue or ping the repository owner.

---

*Generated from codebase analysis — edit as needed for your deployment specifics.*