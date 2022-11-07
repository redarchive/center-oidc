import { User } from '../../users/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

export enum PersonType {
  CURRENT_STUDENT = 0,
  GRADUATED_STUDENT = 1,
  TEACHER = 2,
}

export enum PersonGender {
  MALE = 'M',
  FEMALE = 'F',
}

export enum PersonGrade {
  FIRST_GRADE = 1,
  SECOND_GRADE = 2,
  THIRD_GRADE = 3,
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
    nullable: false,
    charset: 'utf8mb4'
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
    default: PersonType.CURRENT_STUDENT
  })
  public readonly type: PersonType

  @Column({
    name: 'persons_gender',
    type: 'char',
    length: 1,
    nullable: true
  })
  public readonly gender?: PersonGender

  @Column({
    name: 'persons_grade',
    type: 'tinyint',
    unsigned: true,
    nullable: true
  })
  public readonly grade?: PersonGrade

  @Column({
    name: 'persons_classroom',
    type: 'int',
    unsigned: true,
    nullable: true
  })
  public readonly classroom?: number

  @Column({
    name: 'persons_classnumber',
    type: 'int',
    unsigned: true,
    nullable: true
  })
  public readonly classNumber?: number

  @Column({
    name: 'persons_dormitoryroomnumber',
    type: 'varchar',
    nullable: true
  })
  public readonly dormitoryRoomNumber?: number

  @Column({
    name: 'users_id',
    type: 'int',
    unsigned: true,
    nullable: true
  })
  public readonly userId?: number

  @OneToOne(() => User, {
    nullable: true,
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
