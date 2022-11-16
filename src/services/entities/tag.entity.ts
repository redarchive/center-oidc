import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Service } from './service.entity'

@Entity({
  name: 'tags'
})
export class Tag {
  @PrimaryGeneratedColumn('increment', {
    name: 'tags_id',
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_tags_id'
  })
  public readonly id: number

  @Column({
    name: 'tags_label',
    type: 'varchar',
    length: 10
  })
  public readonly label: string

  @Column({
    name: 'services_id',
    type: 'int',
    unsigned: true
  })
  public readonly serviceId: number

  @OneToMany(() => Service, (service) => service.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'services_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_tags_services'
  })
  public readonly service: Service
}
