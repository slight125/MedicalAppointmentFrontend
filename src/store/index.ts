import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import authSlice from './slices/authSlice'
import appointmentSlice from './slices/appointmentSlice'
import userSlice from './slices/userSlice'
import adminSlice from './slices/adminSlice'
import prescriptionSlice from './slices/prescriptionSlice'
import themeSlice from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    appointments: appointmentSlice,
    user: userSlice,
    admin: adminSlice,
    prescriptions: prescriptionSlice,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector)
