import React, { useEffect, useState } from "react";
import { ObjectId } from 'mongodb';
import Link from "next/link";
import { GetServerSideProps, NextPage } from "next";


  type Evento = {
    _id : ObjectId,
    titulo : string,
    descripcion? : string
    fecha : Date 
    horadeinicio : number
    horadefinal : number
    invitados : string[]
  }

  
  export const getServerSideProps: GetServerSideProps = async (context) => {
  
      const {id}  = context.query
      const lines = await fetch(`http://localhost:8080/event/${id}`);
      const data : Evento = await lines.json();
      
      return {    
          props: {
              data
          }
      }
  
  }
  
  
  
  const Index = ({ data}: { data: Evento }) => {
     
      
      return (
        <>
          <h1>DAT2OS</h1>
          {data.titulo}
          {data.descripcion}
  
        </>
      )
    }
  
  
  export default Index