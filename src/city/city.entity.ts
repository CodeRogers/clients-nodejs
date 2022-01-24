import { Client } from '../client/client.entity';
import { State } from '../state/state.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  state_id: number;

  @ManyToOne(() => State, (state) => state.cities, { lazy: true })
  @JoinColumn({ name: 'state_id' })
  state: State;

  @OneToMany(() => Client, (client) => client.city, { lazy: true })
  clients: Client[];
}
