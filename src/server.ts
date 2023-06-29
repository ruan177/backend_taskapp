import Fastify from 'fastify';
import cors from '@fastify/cors'
import { Routes } from './routes';

export const app = Fastify();

app.register(cors)
app.register(Routes)

app.listen({
    port: 3333,
}).then(()=>{
    console.log('HTTP Server Running')
});


