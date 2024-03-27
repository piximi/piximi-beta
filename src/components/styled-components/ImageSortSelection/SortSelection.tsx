import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

import { projectSlice } from "store/slices/project";

import { ThingSortKey_new } from "types/ImageSortType";
import { selectSortTypeNew } from "store/slices/project/selectors";

export const SortSelection = () => {
  const dispatch = useDispatch();

  const selectedSortKey = useSelector(selectSortTypeNew);
  const [selectedKey, setSelectedKey] =
    useState<ThingSortKey_new>(selectedSortKey);

  const onSortKeyChange = (event: SelectChangeEvent<unknown>) => {
    setSelectedKey(event.target.value as ThingSortKey_new);
    dispatch(
      projectSlice.actions.setSortType_new({
        sortType: event.target.value as ThingSortKey_new,
      })
    );
  };

  return (
    <>
      <Select //TODO: This should be a styled component. Styling keeps label in border
        size="small"
        sx={{
          width: 200,
          "& legend": {
            visibility: "visible",
            maxWidth: "100%",
            width: "60px",
            "& span": {
              opacity: 1,
            },
          },
          "& span": {
            opacity: "inherit",
            maxWidth: "100%",
            lineHeight: 0.7,
            position: "absolute ",
          },
        }}
        labelId="sort-select-label"
        value={selectedKey}
        label="Order by:"
        onChange={onSortKeyChange}
      >
        {Object.values(ThingSortKey_new).map((sortType) => (
          <MenuItem key={sortType} value={sortType} dense>
            {sortType}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
