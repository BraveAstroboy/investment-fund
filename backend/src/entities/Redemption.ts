import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('redemptions')
export class Redemption {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    investorAddress: string;

    @Column('decimal', { precision: 36, scale: 18 })
    shares: string;

    @Column('decimal', { precision: 36, scale: 18 })
    usdAmount: string;

    @Column('decimal', { precision: 36, scale: 18 })
    sharePrice: string;

    @Column('varchar', { nullable: true })
    transactionHash: string | null;

    @Column('varchar')
    status: 'PENDING' | 'COMPLETED' | 'FAILED';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 