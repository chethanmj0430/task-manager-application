import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface TasksState {
  tasks: Task[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/tasks');
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message);
    }
    return (await response.json()) as Task[];
  } catch (error) {
    return rejectWithValue((error as Error).message ||'Network error or server unavailable');
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (task: Omit<Task, 'id'>, { rejectWithValue }) => {
  try {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message);
    }
    return (await response.json()) as Task;
  } catch (error) {
    return rejectWithValue((error as Error).message ||'Network error or server unavailable');
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task, { rejectWithValue }) => {
  try {
    const response = await fetch(`/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message);
    }
    
    return task;
  } catch (error) {
    return rejectWithValue((error as Error).message ||'Network error or server unavailable');
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string, { rejectWithValue }) => {
  try {
    const response = await fetch(`/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message);
    }
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message ||'Network error or server unavailable');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;