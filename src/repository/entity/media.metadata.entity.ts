import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Metadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  fullUrl: string;

  @Column({ nullable: false })
  fileName: string;

  @Column()
  fileType: string;

  @Column()
  fileSize: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Column({ default: false })
  softDeleted: boolean;
}
