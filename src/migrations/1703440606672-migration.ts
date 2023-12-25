import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703440606672 implements MigrationInterface {
    name = 'Migration1703440606672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_followers_users" ("taskId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_2bbb380474d2b147b88706f4707" PRIMARY KEY ("taskId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_61a079708f45321702bba23543" ON "task_followers_users" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3e840b619d886c50ba7e8b152e" ON "task_followers_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "task_followers_users" ADD CONSTRAINT "FK_61a079708f45321702bba235436" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_followers_users" ADD CONSTRAINT "FK_3e840b619d886c50ba7e8b152e5" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_followers_users" DROP CONSTRAINT "FK_3e840b619d886c50ba7e8b152e5"`);
        await queryRunner.query(`ALTER TABLE "task_followers_users" DROP CONSTRAINT "FK_61a079708f45321702bba235436"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e840b619d886c50ba7e8b152e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_61a079708f45321702bba23543"`);
        await queryRunner.query(`DROP TABLE "task_followers_users"`);
    }

}
