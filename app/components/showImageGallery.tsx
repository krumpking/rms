import { ref, getDownloadURL } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { FC } from 'react';

import LazyLoad from 'react-lazyload';
import { storage } from '../../firebase/clientApp';
import { print } from '../utils/console';
import ImageGallery from "react-image-gallery";

interface MyProps {
    images: any[]
}



const ShowImageGalleries: FC<MyProps> = ({ images }) => {


    // useEffect(() => {

    //     const pathReference = ref(storage, src);
    //     getDownloadURL(pathReference).then((url) => {
    //         setUrl(url);

    //     })
    //         .catch((error) => {
    //             // Handle any errors
    //             console.error(error);
    //         });

    // }, [url])


    return (
        <LazyLoad>
            <div className="m-auto">
                <ImageGallery items={images} />
            </div>
        </LazyLoad>

    )
};


export default ShowImageGalleries