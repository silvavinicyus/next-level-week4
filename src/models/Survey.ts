import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import {v4 as uuid}  from 'uuid';

@Entity('surveys')
export default class Survey{
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;   

    @Column()
    description: string;

    @CreateDateColumn()
    created_at: string;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }


}