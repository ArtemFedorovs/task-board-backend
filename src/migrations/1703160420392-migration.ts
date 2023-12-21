import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703160420392 implements MigrationInterface {
    name = 'Migration1703160420392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."task_status_enum" RENAME TO "task_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('Backlog', 'Open', 'Blocked', 'Ready for develop', 'Develop in progress', 'Ready for review', 'Review in progress', 'Ready for Test', 'Test in progress', 'Closed')`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "status" TYPE "public"."task_status_enum" USING "status"::"text"::"public"."task_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum_old" AS ENUM('Open', 'Blocked', 'Ready for develop', 'Develop in progress', 'Ready for review', 'Review in progress', 'Ready for Test', 'Test in progress', 'Closed')`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "status" TYPE "public"."task_status_enum_old" USING "status"::"text"::"public"."task_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."task_status_enum_old" RENAME TO "task_status_enum"`);
    }

}
