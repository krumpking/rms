import React, { FC, useEffect, useMemo, useState } from 'react'
import CanvasDraw from "react-canvas-draw";
import { simpleDecrypt } from '../utils/crypto';
import { print } from '../utils/console';
import ShowImage from './showImage';
import ShowVideo from './showVideo';
import { getDate, getMonth } from '../utils/stringM';
import { HexColorPicker } from 'react-colorful';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { MAPS_KEY } from '../constants/constants';
import Loader from './loader';
import GoogleMapReact from 'google-map-react';
import ShowMap from './maps';

interface MyProps {
    num: number,
    info: any,
    code: string,
    codeId?: string,
    min?: number,
    max?: number
}



const ReturnElements: FC<MyProps> = ({ num, info, code, codeId }) => {
    const [elementNo, setElementNo] = useState(0);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MAPS_KEY,
    });
    useEffect(() => {

        if (num < 8 || num > 17 || num == 15) {
            setElementNo(1);
        } else {
            setElementNo(num);
        }


    }, [num])


    const getElement = () => {

        switch (elementNo) {
            case 1:

                return (
                    <p>{simpleDecrypt(info, code)}</p>
                );
            case 8:
                var totalString = simpleDecrypt(info, code);
                var firstString = totalString.substring(0, totalString.indexOf(" - "));
                var secString = totalString.substring(totalString.indexOf(" - ") + 2, totalString.length);

                // Week
                return (
                    <p>{getDate(firstString)} - {getDate(secString)}</p>
                );
            case 9:
                // Month
                return (
                    <p>{getMonth(simpleDecrypt(info, code))}</p>
                );
            case 10:
                // Date
                return (
                    <p>{getDate(simpleDecrypt(info, code))}</p>
                );
            case 11:
                // Image
                return (
                    <ShowImage src={`/${codeId}/11/${simpleDecrypt(info, code
                    )}`} alt={'image'} style={''} />
                );
            case 12:
                // Video
                return (
                    <ShowVideo src={`/${codeId}/12/${simpleDecrypt(info, code
                    )}`} alt={'video'} style={''} />
                );
            case 13:
                // File
                return (
                    <p>{ }</p>
                );
            case 14:
                var color = `#${simpleDecrypt(info, code)}`;
                // Color
                return (
                    <HexColorPicker color={color} />
                );
            case 16: {

                let loc = simpleDecrypt(info, code);
                let lat = loc.substring(loc.indexOf('Lat') + 4, loc.indexOf('Lng'));
                let lng = loc.substring(loc.indexOf(':') + 1, loc.length);


                return (
                    <ShowMap lat={lat} lng={lng} />
                );
            }
            case 17:
                // Signature
                return (
                    <div className='rotate-90 w-full'>
                        <img src={`data:image/jpeg;base64,${simpleDecrypt(info, code)}`} />
                    </div>
                );

            default:
                return (
                    <p>{simpleDecrypt(info, code)}</p>
                );
        }
    }

    return (
        <div>
            {getElement()}
        </div>

    )
};


export default ReturnElements


