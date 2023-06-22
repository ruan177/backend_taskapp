import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

interface Task {
  id: number;
  title: string;
  startdate: Date;
  enddate: Date;
  authorId: number;
}

export const createTaskHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  const { title, startdate, enddate, authorId } = request.body as Task;

  try {
    const createdTask = await prisma.task.create({
      data: {
        title,
        startdate,
        enddate,
        authorId
      }
    });

    return {
      message: "Task created successfully",
      task: createdTask
    };

  } catch (error) {
    return {
      error: error.message
    };
  }
};

export const getTaskHandler = async (request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply): Promise<any> => {
  const taskId = request.params.id;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId
      },
      include: {
        author: true
      }
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return {
      task
    };

  } catch (error) {
    return {
      error: error.message
    };
  }
};

export const updateTaskHandler = async (request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply): Promise<any> => {
  const taskId = request.params.id
  const { title, startdate, enddate, authorId } = request.body as Task;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        title,
        startdate,
        enddate,
        authorId
      }
    });

    return {
      message: "Task updated successfully",
      task: updatedTask
    };

  } catch (error) {
    return {
      error: error.message
    };
  }
};

export const deleteTaskHandler = async (request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply): Promise<any> => {
  const taskId = request.params.id;

  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId
      }
    });

    return {
      message: "Task deleted successfully",
      task: deletedTask
    };

  } catch (error) {
    return {
      error: error.message
    };
  }
}