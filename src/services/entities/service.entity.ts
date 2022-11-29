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
    name: 'services_name',
    type: 'varchar',
    length: 30,
    nullable: false
  })
  public readonly name: string

  @Column({
    name: 'services_description',
    type: 'text',
    nullable: false
  })
  public readonly description: string

  @Column({
    name: 'users_id',
    type: 'int',
    unsigned: true
  })
  public readonly userId?: number

  @OneToMany(() => User, (user) => user.id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'users_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_services_users'
  })
  public readonly user?: User

  @ManyToOne(() => Client, (client) => client.id, {
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
    length: 100
  })
  public readonly logoUrl: string

  @Column({
    name: 'service_promotion_img_url',
    nullable: false,
    type: 'varchar',
    length: 100
  })
  public readonly promotionImageUrl: string

  @Column({
    name: 'service_url',
    nullable: true,
    type: 'varchar',
    length: 100
  })
  public readonly serviceUrl?: string

  @Column({
    name: 'service_source_url',
    nullable: true,
    type: 'varchar',
    length: 100
  })
  public readonly sourceUrl?: string

  @ManyToOne(() => Screenshot, (screenshot) => screenshot.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'screenshots_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_services_screenshots'
  })
  public readonly screenshots: Screenshot[]

  @ManyToOne(() => Tag, (tag) => tag.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'tags_id',
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
}
