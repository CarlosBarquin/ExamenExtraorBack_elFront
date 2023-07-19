import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { eventCollection } from "../db/mongo.ts";

type putEventContext = RouterContext<"/updateEvent", Record<string | number, string | undefined>, Record<string, any>>

export const putEvent = async (context : putEventContext) => {
    try {

        const result = context.request.body({ type: "json" });
        const value = await  result.value 
    
        if (!value?.titulo || !value?.fecha || !value?.inicio || !value?.fin || !value?.invitados || !value?.id) {
            context.response.status = 400;
           return
        }

        const found = await eventCollection.findOne({_id : new ObjectId(value.id)})

        if(!found){
            context.response.status = 404;
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


         // pones las fechas asi :(year-month-day)
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

        if(!DATE){
            context.response.status = 400;
            return
        }

        const event = await eventCollection.findOne({fecha : DATE})

        if(event){
            if(event._id.toString() !== value.id){
                context.response.status = 400;
                return
            }
        }

       
        if(value.descripcion){

            await eventCollection.updateOne({_id : new ObjectId(value.id)}, {$set:{
                titulo : value.titulo,
                descripcion : value.descripcion,
                fecha : DATE,
                horadeinicio : value.inicio,
                horadefinal : value.fin,
                invitados : value.invitados
            }})

            const event = await eventCollection.findOne({_id : new ObjectId(value.id)})

            context.response.body = event

            context.response.status = 200
    
            return

        }

       
        await eventCollection.updateOne({_id : new ObjectId(value.id)}, {$set:{
            titulo : value.titulo,
            descripcion : value.descripcion,
            fecha : DATE,
            horadeinicio : value.inicio,
            horadefinal : value.fin,
            invitados : value.invitados
        }})

        const evento = await eventCollection.findOne({_id : new ObjectId(value.id)})

        context.response.body = evento

        context.response.status = 200

        
    } catch (e) {
        context.response.body = e
    }
}