import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702480984563 implements MigrationInterface {
    name = 'Migration1702480984563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
