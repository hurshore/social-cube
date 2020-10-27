import React, { useState } from 'react';

export const ThemeContext = React.createContext({
  theme: 'dark'
})

const ThemeContextProvider = props => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    if(theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  const setPreferredTheme = (preferredTheme) => {
    setTheme(preferredTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setPreferredTheme }}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider;