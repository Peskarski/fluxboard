import type { SxProps, Theme } from '@mui/material';

export const pageSx: SxProps<Theme> = {
  maxWidth: 640,
  mx: 'auto',
  mt: 6,
  px: 2,
};

export const headerSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 4,
};

export const createFormSx: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  alignItems: 'flex-start',
  mb: 3,
};

export const nameFieldSx: SxProps<Theme> = {
  flexGrow: 1,
};

export const listItemSx: SxProps<Theme> = {
  borderBottom: 1,
  borderColor: 'divider',
};

export const centeredSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  mt: 4,
};
