import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703152073302 implements MigrationInterface {
    name = 'Migration1703152073302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_tracked_tasks_task" ("usersId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_768cf52d5d3457cc8cd8f094539" PRIMARY KEY ("usersId", "taskId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c13cf4fb1f8ede6751478a167a" ON "users_tracked_tasks_task" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eb877a508d02127a6c3ea545db" ON "users_tracked_tasks_task" ("taskId") `);
        await queryRunner.query(`ALTER TABLE "users_tracked_tasks_task" ADD CONSTRAINT "FK_c13cf4fb1f8ede6751478a167a9" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_tracked_tasks_task" ADD CONSTRAINT "FK_eb877a508d02127a6c3ea545db2" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_tracked_tasks_task" DROP CONSTRAINT "FK_eb877a508d02127a6c3ea545db2"`);
        await queryRunner.query(`ALTER TABLE "users_tracked_tasks_task" DROP CONSTRAINT "FK_c13cf4fb1f8ede6751478a167a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb877a508d02127a6c3ea545db"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c13cf4fb1f8ede6751478a167a"`);
        await queryRunner.query(`DROP TABLE "users_tracked_tasks_task"`);
    }

}
