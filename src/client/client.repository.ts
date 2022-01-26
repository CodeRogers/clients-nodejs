import { BadRequestException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Client } from "./client.entity";

@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {

  async findOneByName(name: string): Promise<Client> {
    const clientByName = await this.findOne({
      where: { name: name },
    });

    return clientByName;
  }
}