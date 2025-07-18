import { http, HttpResponse } from 'msw';



interface TaskRequestBody {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface UpdateTaskRequestBody extends TaskRequestBody {
  id: string;
}

let tasks = [
  { id: '1', title: 'Prepare the Task', description: 'Setup vs code, React, Roter, Api, Login', status: 'pending' },
  { id: '2', title: 'Finish Intial Setup', description: 'Completed all pre-requisites implementation', status: 'in-progress' },
  { id: '3', title: 'Start', description: 'Project setup, Development and ui design', status: 'completed' },
  { id: '4', title: 'Standup Updates', description: 'Worked On Task management Assesement', status: 'pending' },
  { id: '5', title: 'Pulish', description: 'Test it and Publish', status: 'in-progress' },
  { id: '6', title: 'Email Assesement', description: 'Complete All the assesement and Email to the HR', status: 'completed' },
  { id: '6', title: 'HR Review', description: 'Code Review, UI Review', status: 'pending' }
];

export const handlers = [
  http.post('/login', async ({ request }) => {
    const { username, password } = (await request.json()) as Record<string, string>;

    const allowedUsers: { [key: string]: string } = {
      'test': 'test123',
      'chethan-mj': 'test123',
      'admin': 'test123',
      'danielle': 'test123'
    };

    if (allowedUsers[username] && allowedUsers[username] === password) {
      const fakeToken = `mock-jwt-token-${username}-${Math.random().toString(36).substring(2, 15)}`;
      return HttpResponse.json({ token: fakeToken }, { status: 200 });
    } else {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  }),

  http.get('/tasks', () => {
    return HttpResponse.json(tasks, { status: 200 });
  }),

  http.post('/tasks', async ({ request }) => {
    const newTaskData = (await request.json()) as TaskRequestBody;

    if (!newTaskData.title || !newTaskData.description || !newTaskData.status) {
      return HttpResponse.json({ message: 'Title, description, and status are required' }, { status: 400 });
    }

    const id = (Math.random() * 1000).toFixed(0);
    const taskWithId = { ...newTaskData, id }; 
    tasks.push(taskWithId);
    return HttpResponse.json(taskWithId, { status: 201 });
  }),

  http.put('/tasks/:id', async ({ request, params }) => {
    const { id } = params;
    const updatedTaskData = (await request.json()) as UpdateTaskRequestBody;

    if (!updatedTaskData.title || !updatedTaskData.description || !updatedTaskData.status) {
      return HttpResponse.json({ message: 'Title, description, and status are required' }, { status: 400 });
    }

    let found = false;
    tasks = tasks.map((task) => {
      if (task.id === id) {
        found = true;
        return { ...task, ...updatedTaskData };
      }
      return task;
    });

    if (found) {
      return HttpResponse.json({ message: 'Task updated successfully' }, { status: 200 });
    } else {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }
  }),

  http.delete('/tasks/:id', ({ params }) => {
    const { id } = params;
    const initialLength = tasks.length;
    tasks = tasks.filter((task) => task.id !== id);

    if (tasks.length < initialLength) {
      return HttpResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    } else {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }
  }),
];