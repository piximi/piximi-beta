import React from "react";

import { Checkbox, Chip } from "@mui/material";
import {
  Label as LabelIcon,
  LabelOutlined as LabelOutlinedIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";

import { Category } from "types";

import { APPLICATION_COLORS } from "utils/common/colorPalette";
import { CustomListItemButton } from "../CustomListItemButton";

type CategoryItemProps = {
  category: Category;
  id: string;
  selectedCategory: Category;
  categoryisVisible: boolean;
  handleToggleCategoryVisibility: (category: Category) => void;
  handleSelectCategory: (category: Category) => void;
  handleOpenCategoryMenu: (
    event: React.MouseEvent<HTMLButtonElement>,
    category: Category
  ) => void;
  objectCount: number;
};

export const CategoryItem = ({
  category,
  id,
  selectedCategory,
  categoryisVisible,
  handleToggleCategoryVisibility,
  handleSelectCategory,
  handleOpenCategoryMenu,
  objectCount,
}: CategoryItemProps) => {
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleOpenCategoryMenu(event, category);
  };
  const handleSelect = () => {
    handleSelectCategory(category);
  };

  return (
    <CustomListItemButton
      selected={category.id === selectedCategory.id}
      primaryText={category.name}
      icon={
        <Checkbox
          checked={categoryisVisible}
          checkedIcon={<LabelIcon />}
          disableRipple
          edge="start"
          sx={{
            color: category.color,
            py: 0,
            "&.Mui-checked": { color: category.color },
          }}
          icon={<LabelOutlinedIcon />}
          tabIndex={-1}
          onChange={() => handleToggleCategoryVisibility(category)}
          size="small"
        />
      }
      sx={{
        backgroundColor:
          category.id === selectedCategory.id
            ? APPLICATION_COLORS.highlightColor
            : "none",
      }}
      onClick={handleSelect}
      secondaryIcon={<MoreHorizIcon />}
      onSecondary={handleOpenMenu}
      additionalComponent={
        <Chip
          label={objectCount}
          size="small"
          sx={(theme) => {
            return {
              height: "1.5em",
              minWidth: "2.5em",
              borderWidth: "2px",
              fontSize: "0.875rem",
              color: theme.palette.text.primary,
              backgroundColor: APPLICATION_COLORS.highlightColor,
            };
          }}
        />
      }
    />
  );
};
