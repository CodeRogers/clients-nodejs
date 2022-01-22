import { City } from 'src/city/entities/city.entity';
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

  @ManyToOne(() => City, (city) => city.clients)
  @JoinColumn({ name: 'city_id' })
  city: City;
}
