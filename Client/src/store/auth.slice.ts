import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadState, saveState } from "./storage";
import { PREFIX } from "../api/API";
import axios, { AxiosError } from "axios";

export const AUTH_PERSISTENT_STATE = 'user';

export interface UserState {
    jwt: string | null;
}

export interface LoginResponse {
  access_token: string;
}

const initialState: UserState = {
    jwt: loadState<UserState>(AUTH_PERSISTENT_STATE)?.jwt ?? null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addJwt: (state, action: PayloadAction<string>) => {
            state.jwt = action.payload;
        },
        logout: (state) => {
          state.jwt = null;
          localStorage.removeItem(AUTH_PERSISTENT_STATE);        },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.fulfilled, (state, action) => {
          state.jwt = action.payload.data.access_token;
          saveState({ jwt: action.payload.data.access_token }, AUTH_PERSISTENT_STATE);
        });
    }
});

export const registration = createAsyncThunk('/auth/register',
    async (params: {name: string; email: string; password: string;
    }) => {
      const response = await axios.post(`${PREFIX}/api/v1/users`, params);
      return response.data;
    }
  );

export const login = createAsyncThunk(
  '/auth/login',
  async (params: {email: string, password: string}, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(`${PREFIX}/api/v1/auth/login`, {
        email: params.email,
        password: params.password
      });
      return response;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) {
          return rejectWithValue("Невірний email або пароль");
        }
        return rejectWithValue('Помилка сервера');
      }
      return rejectWithValue('Невідома помилка під час входу');
    }
  }
);

export default userSlice.reducer;
export const userActions = userSlice.actions;