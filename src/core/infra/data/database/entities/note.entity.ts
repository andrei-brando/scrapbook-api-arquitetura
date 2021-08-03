import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from "./user.entity";

@Entity({ name: 'notes' })
export class NoteEntity extends BaseEntity {

  @PrimaryColumn()
  uid!: string;

  @Column()
  description!: string;

  @Column()
  details?: string;

  @Column({ name: 'user_uid' })
  userUid!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.uid = uuidv4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @ManyToOne(_ => UserEntity, user => user.notes)
  @JoinColumn({ name: 'user_uid', referencedColumnName: 'uid' })
  user!: UserEntity;

  @BeforeUpdate()
  private beforeupdate() {
    this.updatedAt = new Date();
  }
}
