import './App.css';
import ImageUpload from "./components/ImageUpload";
import PaintBrushes from './components/PaintBrushes';
import Paint from './components/Paint';

function App() {
  return (
    <div className="App">
        <h1>🎨Paint Like Me</h1>
        <p>Paint Like Me is an implementation of Painterly Rendering with Curved Brush Strokes of Multiple Sizes (Hertzmann)</p>
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
  );
}

export default App;
