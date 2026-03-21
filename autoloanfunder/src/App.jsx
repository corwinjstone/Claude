import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/shell/AppShell";
import DashboardPage from "./pages/DashboardPage";
import MyQueuePage from "./pages/MyQueuePage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/queue" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="queue" element={<MyQueuePage />} />
          <Route path="applications" element={<MyQueuePage />} />
          <Route path="applications/:id" element={<ApplicationDetailPage />} />
          <Route path="dealerships" element={<MyQueuePage />} />
          <Route path="settings" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
