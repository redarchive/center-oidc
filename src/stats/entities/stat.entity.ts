import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Service } from '../../services/entities/service.entity'

export enum StatTypes {
  VIEW = 0,
  LOGIN
}

@Entity({
  name: 'stats'
})
export class Stat {
  @PrimaryGeneratedColumn('increment', {
    name: 'stats_id',
    primaryKeyConstraintName: 'PK_stats_id',
    unsigned: true,
    type: 'int'
  })
  public readonly id: number

  @Column({
    name: 'stats_type',
    type: 'int',
    unsigned: true,
    nullable: false
  })
  public readonly type: StatTypes

  @Column({
    name: 'stats_date',
    type: 'date',
    nullable: false,
    default: () => 'CURRENT_DATE'
  })
  public readonly date: string

  @Column({
    name: 'stats_counter',
    type: 'int',
    unsigned: true,
    default: 0,
    nullable: false
  })
  public readonly counter: number

  @Column({
    name: 'services_id',
    type: 'int',
    unsigned: true
  })
  public readonly serviceId: number

  @ManyToOne(() => Service, (service) => service.stats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'services_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_stats_services'
  })
  public readonly service: Service
}
