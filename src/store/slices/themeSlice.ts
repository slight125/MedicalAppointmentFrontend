import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ThemeState {
  darkMode: boolean
}

const initialState: ThemeState = {
  darkMode: typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', state.darkMode.toString())
        // Apply theme to document
        if (state.darkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', state.darkMode.toString())
        // Apply theme to document
        if (state.darkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },
  },
})

export const { toggleDarkMode, setDarkMode } = themeSlice.actions
export default themeSlice.reducer
