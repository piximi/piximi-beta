import { CategoryType } from "types/Category";
import { useDialog } from "hooks";
import { DeleteAllCategoriesDialog } from "components/DeleteAllCategoriesDialog";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type DeleteAllCategoriesMenuItemProps = {
  categoryType: CategoryType;
};

export const DeleteAllCategoriesMenuItem = ({
  categoryType,
}: DeleteAllCategoriesMenuItemProps) => {
  const { onClose, onOpen, open } = useDialog();

  return (
    <>
      <ListItem button onClick={onOpen}>
        <ListItemIcon>
          <DeleteIcon color="disabled" />
        </ListItemIcon>

        <ListItemText primary={"Delete all categories"} />
      </ListItem>

      <DeleteAllCategoriesDialog
        categoryType={categoryType}
        onClose={onClose}
        open={open}
      />
    </>
  );
};
