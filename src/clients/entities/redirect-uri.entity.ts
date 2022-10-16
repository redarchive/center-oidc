import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Client } from './client.entity'

@Entity({
  name: 'redirect_uris',
})
export class RedirectURI {
  @PrimaryGeneratedColumn('increment', {
    name: 'redirect_uris_id',
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_redirect_uris_id',
  })
  public readonly id: number

  @Column({
    name: 'redirect_uris_url',
    type: 'varchar',
    length: 100,
  })
  public readonly uri: string

  @Column({
    name: 'clients_id',
    type: 'uuid',
  })
  public readonly clientId: string

  @ManyToOne(() => Client, (client) => client.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'clients_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_redirect_uris_clients',
  })
  public readonly client: Client
}
