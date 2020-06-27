import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';
import { Length } from 'class-validator';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn({ type: 'timestamp', precision: 3, default: () => `timezone('utc', now())`, readonly: true })
  dateCreated: string;

  @Column()
  email: string;

  @Column()
  userName: string;

  @Column()
  @Length(2, 25)
  displayName: string;

  @Column()
  country: string;

  @Column()
  subscription: string;

  @Column()
  refreshToken: string;

  @Column()
  tokenVer: number;
}
