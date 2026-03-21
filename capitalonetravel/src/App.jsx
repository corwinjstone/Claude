import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import FontShowcasePage from "./pages/FontShowcasePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route path="/fonts" element={<FontShowcasePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
