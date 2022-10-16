import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Client } from './client.entity'

export enum ScopeTypes {
  IDENTITY = 0,
  REAL_NAME,
  EMAIL,
  PHONE_NUMBER,
  GENDER,
  CLASS_INFO,
  DORMITORY,
}

@Entity({
  name: 'scopes',
})
export class Scope {
  @PrimaryGeneratedColumn('increment', {
    name: 'scopes_id',
    type: 'int',
    unsigned: true,
  })
  public readonly id: number

  @Column({
    name: 'scopes_type',
    type: 'int',
    unsigned: true,
    nullable: false,
  })
  public readonly type: ScopeTypes

  @Column({
    name: 'scopes_reason',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  public readonly reason: string

  @Column({
    name: 'clients_id',
    type: 'uuid',
    nullable: false,
  })
  public readonly clientId: string

  @ManyToOne(() => Client, (client) => client.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'clients_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_scopes_clients',
  })
  public readonly client: Client
}
