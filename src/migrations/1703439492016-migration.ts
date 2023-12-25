import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703439492016 implements MigrationInterface {
    name = 'Migration1703439492016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_tracked_tasks_task" DROP CONSTRAINT "FK_eb877a508d02127a6c3ea545db2"`);
        await queryRunner.query(`ALTER TABLE "users_tracked_tasks_task" ADD CONSTRAINT "FK_eb877a508d02127a6c3ea545db2" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_tracked_tasks_task" DROP CONSTRAINT "FK_eb877a508d02127a6c3ea545db2"`);
        await queryRunner.query(`ALTER TABLE "users_tracked_tasks_task" ADD CONSTRAINT "FK_eb877a508d02127a6c3ea545db2" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
