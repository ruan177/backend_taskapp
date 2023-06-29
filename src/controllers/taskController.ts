import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import z from 'zod'
import  DateTime  from 'prisma/prisma-client';
import dayjs from 'dayjs'

interface Task {
  id: number;
  title: string;
  startdate: Date;
  enddate: Date;
  authorId: number;
}

export const createTaskHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  const { title, startdate, enddate, authorId } = request.body as Task;
  const startDateConv = dayjs(startdate).toDate();
  const endDateConv = dayjs(enddate).toDate();
  console.log(startDateConv, endDateConv);


  try {
    const createdTask = await prisma.task.create({
      data: {
        title,
        startdate: startDateConv,
        enddate: endDateConv,
        author: {
          connect: { id: Number(authorId) } // Assuming the author ID is a number
        }
      }
    });

    return {
      message: "Task created successfully",
      task: createdTask
    };

  } catch (error: any) {
    return reply.status(422).send(error.message)
  }
};

export const getTasksHandler = async (request: FastifyRequest<{Querystring: {userId: number}}>, reply: FastifyReply): Promise<any> => {
  const userId = request.query.userId;


  try {
    const tasks = await prisma.task.findMany({
      where:{
        authorId: userId
      }
    });
  

    if (!tasks) {
      throw new Error("Tasks not found");
    }

    return {
      tasks
    };

  } catch (error: any) {
    return reply.status(422).send(error.message)
  }
};

export const updateTaskHandler = async (request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply): Promise<any> => {
  const id = request.params.id;
  const taskId = parseInt(id);
  const { title, startdate, enddate, authorId }: Task = request.body as Task;

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

  } catch (error: any) {
    return reply.status(422).send(error.message)
  }
};

export const deleteTaskHandler = async (request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply): Promise<any> => {
  const id = request.params.id;
  const taskId = parseInt(id);
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

  } catch (error: any) {
    return reply.status(422).send(error.message)
  }
}

function jsonParse(startdate: Date) {
  throw new Error('Function not implemented.');
}
