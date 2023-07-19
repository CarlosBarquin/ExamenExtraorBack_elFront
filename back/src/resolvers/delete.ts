import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { eventCollection } from "../db/mongo.ts";


type removeEventContext = RouterContext<"/deleteEvent/:id", {
    id: string;
} & Record<string | number, string | undefined>, Record<string, any>>

export const deleteEvent = async (context : removeEventContext) => {
    try {
        
        const id = context.params.id

        if(!id){
            context.response.status = 400
            return
        }

        const evento = await eventCollection.findOne({_id : new ObjectId(id)})

        if(!evento){
            context.response.status = 404
            return
        }

        await eventCollection.deleteOne({_id : new ObjectId(id)})
        
        context.response.body = evento
        context.response.status = 200

    
        
    } catch (error) {
        context.response.body = error
    }
}