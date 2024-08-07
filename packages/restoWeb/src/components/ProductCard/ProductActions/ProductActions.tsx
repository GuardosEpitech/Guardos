import React from "react";
import { useNavigate } from "react-router-dom";

import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from "@mui/material";

import { NavigateTo } from "@src/utils/NavigateTo";
import styles from "./ProductActions.module.scss";
import { IAction }
  from "shared/models/restaurantInterfaces";
import {useTranslation} from "react-i18next";

interface IProductActionsProps {
  actionList?: IAction[];
  onDelete: any;
  onClick: any;
  className?: any;
}

const ProductActions = (props: IProductActionsProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { actionList, onDelete } = props;
  const navigate = useNavigate();
  const {t} = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={props.className} onClick={props.onClick}>
      <IconButton
        className={styles.ButtonSize}
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button"
        }}
      >
        {actionList &&
          actionList.length !== 0 &&
          actionList.map((action) => (
            <MenuItem
              key={action.actionName}
              onClick={() =>
                NavigateTo(
                  action.actionRedirect,
                  navigate,
                  action.redirectProps
                )
              }
            >
              <ListItemIcon>
                <action.actionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{action.actionName}</ListItemText>
            </MenuItem>
          ))}
        <MenuItem onClick={onDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.delete')}</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProductActions;
