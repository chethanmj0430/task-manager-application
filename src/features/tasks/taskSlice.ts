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

let inMemoryTasks: Task[] = [
  { id: '1', title: 'Prepare the Task', description: 'Setup VS Code, React, Router, API, Login', status: 'pending' },
  { id: '2', title: 'Finish Initial Setup', description: 'Completed all pre-requisites implementation', status: 'in-progress' },
  { id: '3', title: 'Start Project', description: 'Project setup, Development and UI design', status: 'completed' },
  { id: '4', title: 'Standup Updates', description: 'Worked On Task management Assessment', status: 'pending' },
  { id: '5', title: 'Publish Application', description: 'Test it and Publish to Vercel', status: 'in-progress' },
  { id: '6', title: 'Email Assessment', description: 'Complete All the assessment and Email to the HR', status: 'completed' },
  { id: '7', title: 'HR Review', description: 'Code Review, UI Review', status: 'pending' }
];

const generateMockId = (): string => Math.random().toString(36).substring(2, 10);

const initialState: TasksState = {
  tasks: [],
  loading: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      return [...inMemoryTasks];
    } else {
      const response = await fetch('/tasks');
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch tasks from mock API.');
      }
      return (await response.json()) as Task[];
    }
  } catch (error) {
    return rejectWithValue((error as Error).message || 'Network error or server unavailable');
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (task: Omit<Task, 'id'>, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300)); 
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      const newTask = { ...task, id: generateMockId() };
      inMemoryTasks.push(newTask);
      return newTask;
    } else {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to create task from mock API.');
      }
      return (await response.json()) as Task;
    }
  } catch (error) {
    return rejectWithValue((error as Error).message || 'Network error or server unavailable');
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300)); 
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      let taskFound = false;
      inMemoryTasks = inMemoryTasks.map((t) => { 
        if (t.id === task.id) {
          taskFound = true;
          return { ...t, ...task }; 
        }
        return t;
      });
      if (taskFound) {
        return task; 
      } else {
        return rejectWithValue('Task not found for update (mocked).');
      }
    } else {
      const response = await fetch(`/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update task from mock API.');
      }
      
      return task; 
    }
  } catch (error) {
    return rejectWithValue((error as Error).message || 'Network error or server unavailable');
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300)); 
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      const initialLength = inMemoryTasks.length;
      inMemoryTasks = inMemoryTasks.filter((task) => task.id !== id);
      if (inMemoryTasks.length < initialLength) {
        return id; 
      } else {
        return rejectWithValue('Task not found for deletion (mocked).');
      }
    } else {
      const response = await fetch(`/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 204) return id; 
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete task from mock API.');
      }
      return id; 
    }
  } catch (error) {
    return rejectWithValue((error as Error).message || 'Network error or server unavailable');
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