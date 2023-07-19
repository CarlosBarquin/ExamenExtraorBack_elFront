import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Evento } from "../types.ts";

export type EventoSchema = Omit<Evento, "id"> & {
    _id : ObjectId
}