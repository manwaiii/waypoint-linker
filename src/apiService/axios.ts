const axios = require('axios').default;

const instance = axios.create({
  // baseURL: 'https://mock-api.dev.lalamove.com/',
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {'Content-Type': 'application/json'}
});

export const postRouteApi = (startingLocation: string, dropOffPoint: string) => {
  // post route api
  return instance.post('/route', {
    origin: startingLocation,
    destination: dropOffPoint
    // origin:"Innocentre, Hong Kong",
    // destination:"Hong Kong International Airport Terminal 1"
  })
}

export const getRouteApi = (token: string) => {
  return instance.get(`/route/${token}`, {
  })
}