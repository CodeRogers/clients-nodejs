import { EntityRepository, Repository } from 'typeorm';
import { State } from './state.entity';

@EntityRepository(State)
export class StateRepository extends Repository<State> {
  async findOneByName(name: string) {
    const stateByName = await this.findOne({
      where: { name: name },
      relations: ['cities'],
    });

    return stateByName;
  }
}
