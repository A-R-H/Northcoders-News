import React from "react";
import "./FilterSortButton.css";

const FilterSortButton = ({
  whatFilter,
  filtering,
  handleFilterSortButton,
  type
}) => (
  <button
    className={`filtersortbutton ${
      whatFilter === filtering ? "filtersortchosen" : ""
    }`}
    onClick={() => handleFilterSortButton(type, whatFilter)}
  >
    {whatFilter}
  </button>
);

export default FilterSortButton;
