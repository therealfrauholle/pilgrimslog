import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Homepage from './pages/Homepage'
import { createTheme } from '@mui/material/styles';
import { orange,red } from '@mui/material/colors';
import { ThemeProvider } from '@emotion/react';


const theme = createTheme({
  palette: {
    primary: {
      main: orange[500],
    },
    secondary: {
      main: red[500],
    }
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="body">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/:slug" element={<Homepage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
