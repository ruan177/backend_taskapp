import { FastifyInstance } from "fastify";
import { deleteUserHandler, loginHandler, registerHandler, updateUserHandler } from "./controllers/userControllers";
import { createTaskHandler, deleteTaskHandler, getTasksHandler, updateTaskHandler } from "./controllers/taskController";



export async function Routes(app: FastifyInstance){
  app.delete('/users/:id', deleteUserHandler);
  app.put('/users/:id', updateUserHandler);
  app.post('/register', registerHandler);
  app.post('/login', loginHandler);
  app.post('/tasks', createTaskHandler);
  app.get('/tasks', getTasksHandler);
  app.put('/tasks/:id', updateTaskHandler);
  app.delete('/tasks/:id', deleteTaskHandler);
}

