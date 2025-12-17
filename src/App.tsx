import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";
import ToolLayout from "./components/layouts/ToolLayout";

import Home from "./pages/Home";
import Community from "./pages/Community";
import ColorPaletteGenerator from "./pages/ColorPaletteGenerator";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Routes WITH navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          
          {/* Base generator page */}
          <Route path="/colorpalettegenerator"
            element={<ColorPaletteGenerator />}
          />

          {/* Palette via URL */}
          <Route path="/colorpalettegenerator/:palette"
            element={<ColorPaletteGenerator />}
          />
        </Route>

        {/* Routes WITHOUT navbar */}
        <Route element={<ToolLayout />}>
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;