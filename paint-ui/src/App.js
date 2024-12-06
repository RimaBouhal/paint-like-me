import './App.css';
import ImageUpload from "./components/ImageUpload";
import PaintBrushes from './components/PaintBrushes';
import Paint from './components/Paint';

function App() {
  return (
    <div className="App">
        <h1>Paint Like Me</h1>
        <p>Paint Like Me is an implementation of Painterly Rendering with Curved Brush Strokes of Multiple Sizes (Hertzmann)</p>
        <div>
          <ImageUpload/>
        </div>
        <div><PaintBrushes/></div>
        <Paint/>
    </div>
  );
}

export default App;
