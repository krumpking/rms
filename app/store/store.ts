import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { currentPositionSlice } from './reducer';
import { userSlice } from './userReducer';


export const store = configureStore({
    reducer: {
        position: currentPositionSlice.reducer,
        user: userSlice.reducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;