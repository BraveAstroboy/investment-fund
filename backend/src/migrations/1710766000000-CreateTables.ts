import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1710766000000 implements MigrationInterface {
    name = 'CreateTables1710766000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "investments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "investorAddress" character varying NOT NULL,
                "usdAmount" numeric(36,18) NOT NULL,
                "sharesIssued" numeric(36,18) NOT NULL,
                "sharePrice" numeric(36,18) NOT NULL,
                "transactionHash" character varying,
                "status" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "pk_investments" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "redemptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "investorAddress" character varying NOT NULL,
                "shares" numeric(36,18) NOT NULL,
                "usdAmount" numeric(36,18) NOT NULL,
                "sharePrice" numeric(36,18) NOT NULL,
                "transactionHash" character varying,
                "status" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "pk_redemptions" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "fund_metrics" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "totalAssetValue" numeric(36,18) NOT NULL,
                "sharesSupply" numeric(36,18) NOT NULL,
                "sharePrice" numeric(36,18) NOT NULL,
                "lastUpdateTime" bigint NOT NULL,
                "blockNumber" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "pk_fund_metrics" PRIMARY KEY ("id")
            )
        `);

        // Create indexes for better query performance
        await queryRunner.query(`
            CREATE INDEX "idx_investments_investor" ON "investments"("investorAddress")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_redemptions_investor" ON "redemptions"("investorAddress")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_fund_metrics_created" ON "fund_metrics"("createdAt")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_fund_metrics_created"`);
        await queryRunner.query(`DROP INDEX "idx_redemptions_investor"`);
        await queryRunner.query(`DROP INDEX "idx_investments_investor"`);
        await queryRunner.query(`DROP TABLE "fund_metrics"`);
        await queryRunner.query(`DROP TABLE "redemptions"`);
        await queryRunner.query(`DROP TABLE "investments"`);
    }
} 