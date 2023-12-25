import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703500015448 implements MigrationInterface {
    name = 'Migration1703500015448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "verification_token" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verification_token"`);
    }

}
