import React, { FC } from 'react'
import { Grid } from 'react-loader-spinner';
import { PRIMARY_COLOR } from '../constants/constants';

interface MyProps {
    color: string
}


const Loader: FC<MyProps> = ({ color }) => {
    return (
        <Grid
            height="100"
            width="100"
            color={color === "" ? PRIMARY_COLOR : color}
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    )
};


export default Loader
