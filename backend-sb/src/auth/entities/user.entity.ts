import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';
import { Length } from 'class-validator';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn()
  dateCreated: Date;

  @Column()
  email: string;

  @Column()
  @Length(2, 25)
  displayName: string;

  @Column()
  tokenVer: number;
}
