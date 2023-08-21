import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';
// import { Gallery } from '../../pages/main';


export interface UserState {
    value: User;
}

export type User = {
    name: string,
    avatar: string
};


const initialState: UserState = {
    value: { name: "", avatar: "" },
};


export const userSlice = createSlice({
    name: 'user',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

        // Use the PayloadAction type to declare the contents of `action.payload`
        addUser: (state, action: PayloadAction<User>) => {
            state.value = action.payload;
        }
    },


});


export const { addUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.value;



export default userSlice.reducer;