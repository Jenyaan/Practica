import { configureStore } from "@reduxjs/toolkit";
import  userSlice, { AUTH_PERSISTENT_STATE }  from "./auth.slice";
import { saveState } from "./storage.ts";


export const store = configureStore({
	reducer: {
		user: userSlice,
	}
});

store.subscribe(() => {
	saveState({ jwt: store.getState().user.jwt }, AUTH_PERSISTENT_STATE);
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispath = typeof store.dispatch;