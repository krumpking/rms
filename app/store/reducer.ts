import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';


export interface CurrentPositionState {
    value: number;
}



const initialState: CurrentPositionState = {
    value: 0,
};


export const currentPositionSlice = createSlice({
    name: 'position',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

        // Use the PayloadAction type to declare the contents of `action.payload`
        addCurrentPosition: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
        minusCurrentPosition: (state, action: PayloadAction<number>) => {
            state.value -= action.payload;
        },
    },


});


export const selectPosition = (state: RootState) => state.position.value;

export const { addCurrentPosition, minusCurrentPosition } = currentPositionSlice.actions;





export default currentPositionSlice.reducer;