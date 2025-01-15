import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";


export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" index element={<Home />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}


