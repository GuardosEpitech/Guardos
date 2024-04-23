import React, {ReactNode} from "react";

import Button from '@mui/material/Button';
import Dialog  from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from "react-i18next";

interface IRestoDetailOverlayProps {
  isOpen: boolean,
  title?: string,
  children: ReactNode,
  onClose: () => void
}

const ScrollOverlay = (props: IRestoDetailOverlayProps) => {
  const {isOpen, title, children} = props;
  const {t} = useTranslation();

  const handleClose = () => {
    props.onClose();
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (isOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isOpen]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        scroll={'paper'}
        fullWidth
        maxWidth="lg"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        {title ? <DialogTitle id="scroll-dialog-title">{title}</DialogTitle> : null}
        <DialogContent dividers>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ScrollOverlay;
