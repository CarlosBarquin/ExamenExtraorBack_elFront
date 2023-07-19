import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { eventCollection } from "../db/mongo.ts";
import { EventoSchema } from "../db/schemas.ts";

type addEventContext = RouterContext<"/addEvent", Record<string | number, string | undefined>, Record<string, any>>

export const addEvent = async (context : addEventContext) => {
    try {

        const result = context.request.body({ type: "json" });
        const value = await  result.value 
    
        if (!value?.titulo || !value?.fecha || !value?.inicio || !value?.fin || !value?.invitados) {
            context.response.status = 400;
           return
        }
        
        if(value.fin <= value.inicio){
            context.response.status = 400;
            return
        }
        
        if(value.inicio > 23 || value.inicio < 0 ){
            context.response.status = 400;
            return
        }

        if(value.fin > 23 || value.fin < 0 ){
            context.response.status = 400;
            return
        }



        const DATE = new Date(value.fecha)

        if(!DATE){
            context.response.status = 400;
            return
        }

        // pones las fechas asi :(year-month-day) 
        //el mes tiene que tener un 0 delante si es un digito es decir "05" en vez de "5"
        const f : string = value.fecha
        const pos = f.indexOf("-",1)
        const pos2 = f.indexOf("-", pos+1)
        const year = parseInt(f.substring(0,pos))
        const month = parseInt(f.substring(pos+1,f.indexOf("-",pos+1)))
        const day = parseInt(f.substring(pos2+1,f.length))

        if(day > 30 || day < 1 ){
            context.response.status = 400;
            context.response.body = "mald"
            return
        }

        if(month > 12 || month < 1 ){
            context.response.status = 400;
            context.response.body = "malm"
            return
        }

        if(year <= 0){
            context.response.status = 400;
            context.response.body = "maly"
            return
        }

        const event = await eventCollection.findOne({fecha : DATE})

        if(event){
            context.response.status = 400;
            return
        }

        if(value.descripcion){

            const evento : EventoSchema = {
                _id : new ObjectId(),
                titulo : value.titulo,
                descripcion : value.descripcion,
                fecha : DATE,
                invitados : value.invitados,
                horadefinal : value.fin,
                horadeinicio : value.inicio
            } 

            await eventCollection.insertOne(evento)

            context.response.body = evento
            context.response.status = 200

            return

        }

        const evento : EventoSchema = {
            _id : new ObjectId(),
            titulo : value.titulo,
            fecha : DATE,
            invitados : value.invitados,
            horadefinal : value.fin,
            horadeinicio : value.inicio
        }

        await eventCollection.insertOne(evento)

        context.response.body = evento
        context.response.status = 200

        
    } catch (e) {
        context.response.body = e
    }
}