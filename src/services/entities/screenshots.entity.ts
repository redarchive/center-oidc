import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Service } from './service.entity'

@Entity({
  name: 'screenshots'
})
export class Screenshot {
  @PrimaryGeneratedColumn('increment', {
    name: 'screenshots_id',
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_screenshots_id'
  })
  public readonly id: number

  @Column({
    name: 'screenshots_url',
    nullable: false,
    type: 'varchar',
    length: 100
  })
  public readonly url: string

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
    foreignKeyConstraintName: 'FK_screenshots_services'
  })
  public readonly service: Service
}
