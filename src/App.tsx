import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./layouts/Layout";
import Home from "./pages/home";
import Pools from "./pages/pools";
import Simulator from "./pages/simulator";
import "./styles/app.css";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="pools" element={<Pools />} />
          <Route path="simulator" element={<Simulator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
