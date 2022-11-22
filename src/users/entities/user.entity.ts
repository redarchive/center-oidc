import { Client } from '../../clients/entities/client.entity'
import { Person } from '../../persons/entities/person.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity({
  name: 'users'
})
export class User {
  @PrimaryGeneratedColumn('increment', {
    name: 'users_id',
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_users_id'
  })
  public readonly id: number

  @Column({
    name: 'users_login',
    type: 'varchar',
    length: 30,
    nullable: false,
    select: true,
    unique: true
  })
  public readonly login: string

  @Column({
    name: 'users_password',
    type: 'char',
    length: 128,
    nullable: false,
    select: false
  })
  public readonly password: string

  @Column({
    name: 'users_salt',
    type: 'char',
    length: 6,
    nullable: false,
    charset: 'utf8mb4',
    select: false
  })
  public readonly salt: string

  @Column({
    name: 'users_nickname',
    type: 'varchar',
    length: 30,
    nullable: true,
    charset: 'utf8mb4',
    select: true,
    unique: false
  })
  public readonly nickname?: string

  @Column({
    name: 'users_email',
    type: 'varchar',
    length: 30,
    charset: 'utf8mb4',
    nullable: true,
    select: false,
    unique: false
  })
  public readonly email?: string

  @Column({
    name: 'users_profile_image',
    type: 'varchar',
    length: 100,
    nullable: true
  })
  public readonly profileImage?: string

  @Column({
    name: 'users_createdat',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP'
  })
  public readonly createdAt: Date

  @Column({
    name: 'users_deletedat',
    type: 'timestamp',
    nullable: true
  })
  public readonly deletedAt: Date

  @OneToOne(() => Person, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'persons_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_users_persons'
  })
  public readonly person?: Person

  @OneToMany(() => Client, (client) => client.user)
  public readonly clients: Client[]
}
