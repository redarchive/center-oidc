import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum PersonType {
  CURRNET_STUDENT = 0,
  GRADUATED_STUDENT = 1,
  TEACHER = 2
}

@Entity({
  name: 'persons'
})
export class Person {
  @PrimaryGeneratedColumn('increment', {
    name: 'persons_id',
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_persons_id'
  })
  public readonly id: number

  @Column({
    name: 'persons_name',
    type: 'varchar',
    length: 5,
    nullable: false
  })
  public readonly name: string

  @Column({
    name: 'persons_phone',
    type: 'char',
    unique: true,
    length: 11,
    nullable: false
  })
  public readonly phone: string

  @Column({
    name: 'persons_type',
    type: 'int',
    unsigned: true,
    nullable: false,
    default: PersonType.CURRNET_STUDENT
  })
  public readonly type: PersonType

  @OneToOne(() => User, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'users_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_persons_users'
  })
  public readonly user?: User
}
