import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('fund_metrics')
export class FundMetrics {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 36, scale: 18 })
    totalAssetValue: string;

    @Column('decimal', { precision: 36, scale: 18 })
    sharesSupply: string;

    @Column('decimal', { precision: 36, scale: 18 })
    sharePrice: string;

    @Column('bigint')
    lastUpdateTime: string;

    @Column('varchar')
    blockNumber: string;

    @CreateDateColumn()
    createdAt: Date;
} 