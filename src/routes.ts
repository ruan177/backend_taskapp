import { FastifyInstance } from "fastify";
import { z } from "zod";
import {compare, hash} from 'bcrypt'
import {prisma} from './lib/prisma'

export async function Routes(app: FastifyInstance){
    app.post('/register', async(request)=>{
        const userType = z.object({
            username: z.string(),
            email: z.string(),
            password: z.string()
        })
        const {username, email, password} = userType.parse(request.body)

        const hashedPassword: string  =  await hash(password, 8)

        const response  = await prisma.user.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword
            }
        })
        return{
            response
            
        }
    })
    app.post('/login', async(request)=>{
        const userAuthType = z.object({

            email: z.string(),
            password: z.string()
        })
        const {email, password} = userAuthType.parse(request.body)

        try {
            const userAlreadyExists = await prisma.user.findFirst({
                where: {
                    email
                }
            })
            if (!userAlreadyExists) {
                throw new Error("unregistered user or incorrect email");
            }
    
            const passwordMatch = await compare(password, userAlreadyExists.password)
    
            if (!passwordMatch) {
                throw new Error("unregistered user or incorrect email")
            }

            return{
                id: userAlreadyExists.id
            }
            

            
        } catch (error:any) {
            return error
        }

        
       
    })

}
  