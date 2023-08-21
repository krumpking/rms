import { ref, getDownloadURL } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { FC } from 'react';
import { storage } from '../../firebase/clientApp';
import { print } from '../utils/console';
import ReactPlayer from 'react-player'

interface MyProps {
    src: string,
    alt: string,
    style: string
}



const ShowVideo: FC<MyProps> = ({ src, alt, style }) => {
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

        <div className="m-auto">
            {/* <img src={url} alt={alt} className={style + ' object-cover'} /> */}
            <ReactPlayer url={url} controls className="w-full max-h-96" />
        </div>


    )
};


export default ShowVideo