import { User } from '../../users/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { RedirectURI } from './redirect-uri.entity'
import { Scope } from './scope.entity'

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
    nullable: false
  })
  public readonly name: string

  @Column({
    name: 'clients_secret',
    type: 'char',
    length: '30',
    nullable: false,
    select: false
  })
  public readonly secret: string

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

  @OneToMany(() => RedirectURI, (uri) => uri.client, {
    eager: true
  })
  public readonly redirectUrls: RedirectURI[]

  @OneToMany(() => Scope, (scope) => scope.client, {
    eager: true
  })
  public readonly scopes: Scope[]
}
