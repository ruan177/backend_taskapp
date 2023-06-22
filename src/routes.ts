import { FastifyInstance } from "fastify";
import { deleteUserHandler, loginHandler, registerHandler, updateUserHandler } from "./controllers/userControllers";
import { createTaskHandler, deleteTaskHandler, getTaskHandler, updateTaskHandler } from "./controllers/taskController";



export async function Routes(app: FastifyInstance){
  app.delete('/user/:id', deleteUserHandler);
  app.put('/user/:id', updateUserHandler);
  app.post('/register', registerHandler);
  app.post('/login', loginHandler);
  app.post('/tasks', createTaskHandler);
  app.get('/tasks/:id', getTaskHandler);
  app.put('/tasks/:id', updateTaskHandler);
  app.delete('/tasks/:id', deleteTaskHandler);
}

