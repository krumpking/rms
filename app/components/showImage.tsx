import { ref, getDownloadURL } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { FC } from 'react';

import LazyLoad from 'react-lazyload';
import { storage } from '../../firebase/clientApp';
import { print } from '../utils/console';


interface MyProps {
    src: string,
    alt: string,
    style: string
}



const ShowImage: FC<MyProps> = ({ src, alt, style }) => {
    const [url, setUrl] = useState("");

    useEffect(() => {

        const pathReference = ref(storage, src);
        getDownloadURL(pathReference).then((url) => {
            setUrl(url);

        })
            .catch((error) => {
                // Handle any errors
                console.error(error);
            });

    }, [url])


    return (
        <LazyLoad>
            <div className="m-auto">
                <img src={url} alt={alt} className={style + ' object-cover w-full max-h-96'} />
            </div>
        </LazyLoad>

    )
};


export default ShowImage