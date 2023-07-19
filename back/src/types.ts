
export type Evento = {
  id : string,
  titulo : string,
  descripcion? : string
  fecha : Date 
  horadeinicio : number
  horadefinal : number
  invitados : string[]
}