import {FastifyRequest, FastifyReply } from 'fastify';
import {compare, hash} from 'bcrypt'
import {prisma} from '../lib/prisma'
import z from 'zod'

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
  }
  
  
 export const deleteUserHandler = async (request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply): Promise<any> => {
    const userId = request.params.id;
  
    try {
      const userExists = await prisma.user.findFirst({
        where: {
          id: userId
        }
      });
  
      if (!userExists) {
        throw new Error("User not found");
      }
  
      const deletedUser = await prisma.user.delete({
        where: {
          id: userId
        }
      });
  
      return {
        message: "User deleted successfully",
        deletedUser
      };
  
    } catch (error: any) {
      return reply.status(422).send(error.message)
    }
  };
  
  export  const updateUserHandler = async (request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply): Promise<any> => {
    const id = request.params.id
    const userId =parseInt(id);
    const {name, email, password } = request.body as User;
  
    try {
      const userExists = await prisma.user.findFirst({
        where: {
          id: userId
        }
      });
  
      if (!userExists) {
        throw new Error("User not found");
      }
      const hashedPassword: string = await hash(password, 8);
  
      const updatedUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          name,
          email,
          password: hashedPassword
        }
      });
  
      return {
        updatedUser
      }
      
  
    } catch (error: any) {
      return reply.status(422).send(error.message)
    }
  };
  
  export  const registerHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
    const { name, email, password } = request.body as User;
  
    try {
      const hashedPassword: string = await hash(password, 8);
  
      const response = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      });
  
      return {
        response
      }
  
    } catch (error: any) {
      return reply.status(422).send(error.message)
    }
  };
  
  export  const loginHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
    const { email, password } = request.body as User;
  
    try {
      const userAlreadyExists = await prisma.user.findFirst({
        where: {
          email
        }
      });
  
      if (!userAlreadyExists) {
        throw new Error("Unregistered user or incorrect email");
      }
  
      const passwordMatch = await compare(password, userAlreadyExists.password);
  
      if (!passwordMatch) {
        throw new Error("Unregistered user or incorrect email");
      }
  
      return {
        id:userAlreadyExists.id
      }
        
      
  
    } catch (error: any) {
      
       return reply.status(422).send(error.message)
      
    }
  };
  