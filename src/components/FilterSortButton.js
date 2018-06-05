import React from "react";
import PT from "prop-types";
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

FilterSortButton.propTypes = {
  whatFilter: PT.string,
  handleFilterSortButton: PT.func,
  filtering: PT.string,
  type: PT.string
};

export default FilterSortButton;
