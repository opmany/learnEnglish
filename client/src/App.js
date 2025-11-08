import React, { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMediaQuery } from '@mui/material';
import Layout from "./components/Layout";
import Home from "./pages/Home";
import WordsShowcase from "./pages/WordsShowcase";
import MatchingGamePage from "./pages/MatchingGamePage";
import MultipleChoiceQuizPage from "./pages/MultipleChoiceQuizPage";
import FlashCardsPage from "./pages/FlashCardsPage";
import ExamEditor from "./pages/ExamEditor";

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main:  mode === 'light' ? '#4F46E5' : '#BB86FC',
            light: mode === 'light' ? '#818CF8' : '#D8B4FE',
            dark: mode === 'light' ? '#4338CA' : '#6B21A8',
          },
          secondary: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
          },
          background: {
            default: mode === 'light' ? '#F3F4F6' : '#121212',
            paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
          },
          text: {
            primary: mode === 'light' ? '#111827' : '#FFFFFF',
            secondary: mode === 'light' ? '#4B5563' : '#9CA3AF',
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
                padding: '8px 16px',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'light' 
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)',
              },
            },
          },
        },
      }),
    [mode],
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout toggleColorMode={toggleColorMode} mode={mode}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/WordsShowcase" element={<WordsShowcase/>} />
            <Route path="/MatchingGamePage" element={<MatchingGamePage/>} />
            <Route path="/MultipleChoiceQuizPage" element={<MultipleChoiceQuizPage />} />
            <Route path="/FlashCardsPage" element={<FlashCardsPage />} />
            <Route path="/ExamEditor" element={<ExamEditor/>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
