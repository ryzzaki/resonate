import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserGoogleIdentity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @Column()
  googleId: string;
}
