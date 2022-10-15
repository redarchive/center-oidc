import { Person } from "src/persons/entities/person.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
    length: 5,
    nullable: false,
    select: false
  })
  public readonly salt: string

  @Column({
    name: 'users_nickname',
    type: 'varchar',
    length: 30,
    nullable: true,
    select: true,
    unique: false
  })
  public readonly nickname?: string

  @Column({
    name: 'users_email',
    type: 'varchar',
    length: 30,
    nullable: true,
    select: false,
    unique: false
  })
  public readonly email?: string

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
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'persons_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_users_persons'
  })
  public readonly person: Person
}
