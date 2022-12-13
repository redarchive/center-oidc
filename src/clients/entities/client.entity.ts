import { User } from '../../users/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { RedirectURI } from './redirect-uri.entity'
import { Scope } from './scope.entity'
import { Service } from '../../services/entities/service.entity'

@Entity({
  name: 'clients'
})
export class Client {
  @PrimaryGeneratedColumn('uuid', {
    name: 'clients_id',
    primaryKeyConstraintName: 'PK_clients_id'
  })
  public readonly id: string

  @Column({
    name: 'clients_name',
    type: 'varchar',
    length: 30,
    nullable: false,
    charset: 'utf8mb4'

  })
  public readonly name: string

  @Column({
    name: 'users_id',
    type: 'int',
    unsigned: true
  })
  public readonly userId: number

  @OneToMany(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'users_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_clients_users'
  })
  public readonly user?: User

  @Column({
    name: 'services_id',
    type: 'int',
    unsigned: true
  })
  public readonly serviceId: number

  @ManyToOne(() => Service, (service) => service.clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'services_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_clients_services'
  })
  public readonly service: Service

  @OneToMany(() => RedirectURI, (uri) => uri.client, {
    eager: true
  })
  public readonly redirectUris: RedirectURI[]

  @OneToMany(() => Scope, (scope) => scope.client, {
    eager: true
  })
  public readonly scopes: Scope[]
}
