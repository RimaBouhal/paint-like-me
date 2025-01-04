import './App.css';
import ImageUpload from "./components/ImageUpload";
import PaintBrushes from './components/PaintBrushes';
import Paint from './components/Paint';
import Header from './components/Header';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#372A7A'
    },
    secondary: {
      main: '#BBB3E5'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
          <Header></Header>
          <div class='flex-container'>
            <div class="flex-child image">
              <ImageUpload/>
            </div>
            <div class="flex-child painting">
              <Paint/>
            </div>
          </div>
          <div><PaintBrushes/></div>
      </div>
    </ThemeProvider>
  );
}

export default App;
