import React from "react";
import UpCircle from "../assets/icons/up.svg";
import "../styles/icon.css";

interface Props {
  onClick?: () => void;
  title?: string;
}

const Icon = ({ onClick, title }: Props) => {
  const handleOnClick = () => {
    if (onClick) onClick();
  };

  return (
    <div className="icon-container" onClick={handleOnClick} title={title}>
      <UpCircle />
    </div>
  );
};

export default Icon;
