import { Client } from 'src/client/entities/client.entity';
import { State } from 'src/state/entities/state.entity';
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

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @OneToMany(() => Client, (client) => client.city)
  clients: Client[];
}
