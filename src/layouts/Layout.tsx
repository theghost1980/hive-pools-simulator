import React from "react";
import { NavLink, Outlet } from "react-router";
import "../styles/layout.css";

const Layout = () => {
  return (
    <div>
      <nav>
        <ul className="navbar">
          <li>
            <NavLink to="/" end>
              <img src={"./assets/logos/HPS.png"} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/pools" end>
              Pools
            </NavLink>
          </li>
          <li>
            <NavLink to="/positions" end>
              Positions
            </NavLink>
          </li>
          <li>
            <NavLink to="/simulator" end>
              Simulator
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
