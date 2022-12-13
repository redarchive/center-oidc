import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
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
    length: 10,
    charset: 'utf8mb4'
  })
  public readonly label: string

  @Column({
    name: 'services_id',
    type: 'int',
    unsigned: true
  })
  public readonly serviceId: number

  @ManyToOne(() => Service, (service) => service.tags, {
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
