import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Client } from '../../clients/entities/client.entity'
import { User } from '../../users/entities/user.entity'
import { Screenshot } from './screenshots.entity'
import { Tag } from './tag.entity'

export enum ServiceTypes {
  WEBSITE = 0,
  DESKTOP,
  MOBILE,
  GAME,
  PHYSICAL
}

@Entity({
  name: 'services'
})
export class Service {
  @PrimaryGeneratedColumn('increment', {
    name: 'services_idx',
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_services_id'
  })
  public readonly id: number

  @Column({
    name: 'services_views',
    type: 'int',
    unsigned: true,
    default: 0,
    nullable: false
  })
  public readonly views: number

  @Column({
    name: 'services_name',
    type: 'varchar',
    length: 30,
    nullable: false,
    charset: 'utf8mb4'
  })
  public readonly name: string

  @Column({
    name: 'services_description',
    type: 'text',
    nullable: false,
    charset: 'utf8mb4'
  })
  public readonly description: string

  @Column({
    name: 'users_id',
    type: 'int',
    unsigned: true,
    nullable: true
  })
  public readonly userId?: number

  @ManyToOne(() => User, (user) => user.services, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'users_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_services_users'
  })
  public readonly user?: User

  @OneToMany(() => Client, (client) => client.service, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'services_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_services_clients'
  })
  public readonly clients: Client[]

  @Column({
    name: 'service_logo_url',
    nullable: false,
    type: 'varchar',
    length: 100,
    charset: 'utf8mb4'

  })
  public readonly logoUrl: string

  @Column({
    name: 'service_promotion_img_url',
    nullable: false,
    type: 'varchar',
    length: 100,
    charset: 'utf8mb4'

  })
  public readonly promotionImageUrl: string

  @Column({
    name: 'service_url',
    nullable: true,
    type: 'varchar',
    length: 100,
    charset: 'utf8mb4'

  })
  public readonly serviceUrl?: string

  @Column({
    name: 'service_source_url',
    nullable: true,
    type: 'varchar',
    length: 100,
    charset: 'utf8mb4'
  })
  public readonly sourceUrl?: string

  @OneToMany(() => Screenshot, (screenshot) => screenshot.service, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'services_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_services_screenshots'
  })
  public readonly screenshots: Screenshot[]

  @OneToMany(() => Tag, (tag) => tag.service, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'services_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_services_tags'
  })
  public readonly tags: Tag[]

  @Column({
    name: 'services_type',
    type: 'int',
    unsigned: true,
    nullable: false
  })
  public readonly type: ServiceTypes

  @Column({
    name: 'services_created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP'
  })
  public readonly createdAt: Date
}
