import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";
import ToolLayout from "./components/layouts/ToolLayout";

import Home from "./pages/Home";
import ColorPaletteGeneratorLaunch from "./pages/ColorPaletteGeneratorLaunch";
import Community from "./pages/Community";

import ColorPaletteGenerator from "./tools/ColorPaletteGenerator";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Routes WITH navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/colorpalettegeneratorlaunch" element={<ColorPaletteGeneratorLaunch />} />
          <Route path="/community" element={<Community />} />
        </Route>

        {/* Routes WITHOUT navbar */}
        <Route element={<ToolLayout />}>
          <Route path="/colorpalettegenerator" element={<ColorPaletteGenerator />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;