import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703761197176 implements MigrationInterface {
    name = 'Migration1703761197176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "board_participants_users" ("boardId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_8358ce8599f547e9b6bbf2d4eb5" PRIMARY KEY ("boardId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0c4db0c9963606b62c13eafe5b" ON "board_participants_users" ("boardId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c4b45c53cc9ba425b43cb20a0a" ON "board_participants_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "board_participants_users" ADD CONSTRAINT "FK_0c4db0c9963606b62c13eafe5b7" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "board_participants_users" ADD CONSTRAINT "FK_c4b45c53cc9ba425b43cb20a0ac" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board_participants_users" DROP CONSTRAINT "FK_c4b45c53cc9ba425b43cb20a0ac"`);
        await queryRunner.query(`ALTER TABLE "board_participants_users" DROP CONSTRAINT "FK_0c4db0c9963606b62c13eafe5b7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c4b45c53cc9ba425b43cb20a0a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c4db0c9963606b62c13eafe5b"`);
        await queryRunner.query(`DROP TABLE "board_participants_users"`);
    }

}
