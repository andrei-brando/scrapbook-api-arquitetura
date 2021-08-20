import {
  Entity,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from "typeorm";
import { v4 as uuid } from 'uuid';
import { NoteEntity } from "./note.entity";

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  uid!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(_ => NoteEntity, note => note.user)
  notes?: NoteEntity[];

  @BeforeInsert()
  private beforeInsert() {
    this.uid = uuid();
    this.createdAt = new Date(Date.now());
    this.updatedAt = new Date(Date.now());
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date(Date.now());
  }
}
