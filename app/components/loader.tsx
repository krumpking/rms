import React from 'react'
import { Grid } from 'react-loader-spinner';
import { PRIMARY_COLOR } from '../constants/constants';



const Loader = () => {
    return (
        <Grid
            height="100"
            width="100"
            color={PRIMARY_COLOR}
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    )
};


export default Loader
