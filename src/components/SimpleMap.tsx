import { useEffect, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import { apiKeyValue } from '../const';

declare var google: any;
interface MarkerProps{
  lat: number;
  lng: number;
}

interface SimpleMapProps {
    center: {
      lat: number,
      lng: number
    },
    zoom: number,
    waypoint: any,
}

const SimpleMap = (props: SimpleMapProps) =>  { 
  const loadedMap = useRef<{}>();

  useEffect(() => {
    if ( !loadedMap.current ) return;
    if ( props.waypoint.length == 0 ) return;

    let latLngArray = props.waypoint.map((element: string[]) => {
      return {
        lat: parseFloat(element[0]),
        lng: parseFloat(element[1]),
      }
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(loadedMap.current);
    
    const origin = latLngArray.shift();
    const destination = latLngArray.pop();
    const waypoint = latLngArray.map((element: any) => {
      return {
        location: element,
      }
    });

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypoint,
      },
      (result: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [loadedMap.current]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKeyValue }}
        defaultCenter={props.center}
        defaultZoom={props.zoom}
        onGoogleApiLoaded={({ map, maps }) => {
          loadedMap.current = map;
        }}
      >
      </GoogleMapReact>
    </div>
  );
}

export default SimpleMap;