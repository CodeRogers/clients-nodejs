import { City } from '../city/city.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  birth_date: string;

  @Column()
  city_id: number;

  @ManyToOne(() => City, (city) => city.clients, { lazy: true })
  @JoinColumn({ name: 'city_id' })
  city: City;
}
