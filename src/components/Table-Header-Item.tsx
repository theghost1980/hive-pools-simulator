import React, { useEffect, useState } from "react";
import "../styles/table-header-item.css";
import { PoolDataFields } from "../types/pool";
import Icon from "./Icon";

interface Props {
  orderBy: PoolDataFields;
  onClick: (orderBy: PoolDataFields, asc?: boolean) => void;
  selected: PoolDataFields;
}

const TableHeaderItem = ({ onClick, orderBy, selected }: Props) => {
  const [selectedHeader, setSelectedHeader] = useState("");

  const onClickHandler = (asc?: boolean) => {
    onClick(orderBy, asc);
    setSelectedHeader(orderBy);
  };

  useEffect(() => {
    setSelectedHeader(selected);
  }, [selected]);

  return (
    <div
      className={`table-head-container ${
        orderBy === selectedHeader ? "table-ordered-by" : ""
      }`}
    >
      {orderBy}
      <div className="table-filter-container">
        <Icon title="Order Asc" onClick={() => onClickHandler(true)} />
        <Icon title="Order Des" onClick={() => onClickHandler()} />
      </div>
    </div>
  );
};

export default TableHeaderItem;
