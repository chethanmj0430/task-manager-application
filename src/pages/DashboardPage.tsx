import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask, type Task } from '../features/tasks/taskSlice';
import { type AppDispatch, type RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { toggleThemeMode } from '../features/ui/uiSlice';
import { useNavigate } from 'react-router-dom';

import {
  Container, Box, Typography, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, IconButton, Select, MenuItem, InputLabel, FormControl,
  Alert, AppBar, Toolbar, CircularProgress, Card, CardContent, CardActions,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AddTaskIcon from '@mui/icons-material/AddTask';
import SearchIcon from '@mui/icons-material/Search';


const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(fetchTasks());
    }
  }, [isAuthenticated, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOpenModal = (task?: Task) => {
    setIsModalOpen(true);
    if (task) {
      setCurrentTask(task);
      setTaskTitle(task.title);
      setTaskDescription(task.description);
      setTaskStatus(task.status);
    } else {
      setCurrentTask(null);
      setTaskTitle('');
      setTaskDescription('');
      setTaskStatus('pending');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus('pending');
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTask) {
      dispatch(updateTask({ ...currentTask, title: taskTitle, description: taskDescription, status: taskStatus }));
    } else {
      dispatch(createTask({ title: taskTitle, description: taskDescription, status: taskStatus }));
    }
    handleCloseModal();
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const filteredTasks = useMemo(() => {
    if (!searchTerm) {
      return tasks;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      task.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [tasks, searchTerm]);


  return (
    <Container maxWidth="lg" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar sx={{ flexDirection: isSmallScreen ? 'column' : 'row', py: isSmallScreen ? 1 : 0 }}>
          <Typography
            variant={isSmallScreen ? "h6" : "h5"}
            component="div"
            sx={{ flexGrow: 1, mb: isSmallScreen ? 1 : 0, textAlign: isSmallScreen ? 'center' : 'left' }}
          >
            Task Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSmallScreen ? 'center' : 'flex-end', width: isSmallScreen ? '100%' : 'auto' }}>
            <IconButton sx={{ ml: isSmallScreen ? 0 : 1 }} onClick={() => dispatch(toggleThemeMode())} color="inherit">
              {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Button color="inherit" onClick={handleLogout} sx={{ ml: isSmallScreen ? 1 : 0 }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{
          display: 'flex',
          flexDirection: isMediumScreen ? 'column' : 'row', 
          justifyContent: 'space-between',
          alignItems: isMediumScreen ? 'flex-start' : 'center',
          mb: 2,
          gap: 2,
          width: '100%' 
      }}>
        <Typography variant={isSmallScreen ? "h5" : "h4"} component="h2" sx={{ width: isMediumScreen ? '100%' : 'auto', textAlign: isMediumScreen ? 'center' : 'left' }}>
          Your Tasks
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', gap: 2, width: isMediumScreen ? '100%' : 'auto' }}>
          <TextField
            label="Search tasks"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon color="action" sx={{ mr: 1 }} />
              ),
            }}
            fullWidth={isSmallScreen}
          />
          <Button variant="contained" startIcon={<AddTaskIcon />} onClick={() => handleOpenModal()} fullWidth={isSmallScreen}>
            Add New Task
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Error loading tasks: {error}</Alert>}

      {loading === 'pending' && tasks.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading tasks...</Typography>
        </Box>
      ) : filteredTasks.length === 0 && loading === 'succeeded' && searchTerm === '' ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No tasks found. Start by adding a new task!
          </Typography>
        </Box>
      ) : filteredTasks.length === 0 && searchTerm !== '' ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No tasks found matching "{searchTerm}".
          </Typography>
        </Box>
      ) : (
        <List
            sx={{
                display: 'grid',
                
                gridTemplateColumns: {
                    xs: 'repeat(auto-fill, minmax(280px, 1fr))',
                    sm: 'repeat(auto-fill, minmax(300px, 1fr))',
                    md: 'repeat(auto-fill, minmax(320px, 1fr))',
                    lg: 'repeat(auto-fill, minmax(350px, 1fr))', 
                },
                gap: 2,
                justifyContent: 'center', 
            }}
        >
          {filteredTasks.map((task) => (
            <ListItem key={task.id} disablePadding sx={{ mb: 2, display: 'flex' }}>
              <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {task.description}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Status: {task.status.replace('-', ' ').toUpperCase()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                  <IconButton aria-label="edit" onClick={() => handleOpenModal(task)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDeleteTask(task.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{currentTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <Box component="form" onSubmit={handleSaveTask} noValidate>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={taskStatus}
                label="Status"
                onChange={(e) => setTaskStatus(e.target.value as 'pending' | 'in-progress' | 'completed')}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseModal} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};

export default DashboardPage;