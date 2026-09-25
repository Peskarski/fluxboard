import { useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import type { CreateBoardInput } from '@fluxboard/shared';
import { useCurrentUser, useLogout } from '../features/auth/useAuth';
import { useBoards, useCreateBoard, useDeleteBoard } from '../features/boards/useBoards';
import {
  centeredSx,
  createFormSx,
  headerSx,
  listItemSx,
  nameFieldSx,
  pageSx,
} from './BoardsPage.styles';

export function BoardsPage() {
  const { data: currentUser } = useCurrentUser();
  const logout = useLogout();
  const boards = useBoards();
  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateBoardInput>();

  const onSubmit = handleSubmit((input) => {
    createBoard.mutate(input, { onSuccess: () => reset() });
  });

  return (
    <Box sx={pageSx}>
      <Box sx={headerSx}>
        <Box>
          <Typography variant="h4" component="h1">
            Boards
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentUser?.user.email}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => logout.mutate()}>
          Log out
        </Button>
      </Box>

      <Box component="form" onSubmit={onSubmit} sx={createFormSx}>
        <TextField
          label="New board name"
          size="small"
          sx={nameFieldSx}
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            validate: (value) => value.trim().length > 0 || 'Name is required',
            maxLength: { value: 100, message: 'Name must be at most 100 characters' },
          })}
        />
        <Button type="submit" variant="contained" disabled={createBoard.isPending}>
          Create
        </Button>
      </Box>
      {createBoard.isError && <Alert severity="error">{createBoard.error.message}</Alert>}

      {boards.isLoading && (
        <Box sx={centeredSx}>
          <CircularProgress />
        </Box>
      )}
      {boards.isError && <Alert severity="error">{boards.error.message}</Alert>}
      {boards.data?.length === 0 && (
        <Typography color="text.secondary">No boards yet — create your first one.</Typography>
      )}
      <List>
        {boards.data?.map((board) => (
          <ListItem
            key={board.id}
            sx={listItemSx}
            secondaryAction={
              <Button
                color="error"
                size="small"
                disabled={deleteBoard.isPending}
                onClick={() => deleteBoard.mutate(board.id)}
              >
                Delete
              </Button>
            }
          >
            <ListItemText
              primary={board.name}
              secondary={new Date(board.createdAt).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
