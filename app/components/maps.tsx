import { FC, memo, useCallback, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { MAPS_KEY } from "../constants/constants";


interface MyProps {
    lat: string,
    lng: string
}

const containerStyle = {
    width: '400px',
    height: '400px'
};


const ShowMap: FC<MyProps> = ({ lat, lng }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: MAPS_KEY
    });

    const [map, setMap] = useState<any>(null);

    const center = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
    };



    const onLoad = useCallback(function callback(map: any) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, []);


    const onUnmount = useCallback(function callback(map: any) {
        setMap(null)
    }, [])


    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            { /* Child components, such as markers, info windows, etc. */}
            <></>
        </GoogleMap>
    ) : <></>

};
export default memo(ShowMap)