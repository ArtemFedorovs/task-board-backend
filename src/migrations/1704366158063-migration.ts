import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1704366158063 implements MigrationInterface {
    name = 'Migration1704366158063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "expired_at"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "expired_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "expired_at"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "expired_at" date`);
    }

}
