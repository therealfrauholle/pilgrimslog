
import RoutingService from './services/RoutingService';
import { createTheme } from '@mui/material/styles';
import { orange, red } from '@mui/material/colors';
import { ThemeProvider } from '@emotion/react';
import BookLayout from './components/BookLayout';


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
      <BookLayout>
        <RoutingService />
      </BookLayout>
    </ThemeProvider>
  );
};

export default App;
