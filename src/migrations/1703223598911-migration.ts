import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703223598911 implements MigrationInterface {
    name = 'Migration1703223598911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_email_verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_email_verified"`);
    }

}
