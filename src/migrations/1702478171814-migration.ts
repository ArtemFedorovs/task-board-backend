import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702478171814 implements MigrationInterface {
    name = 'Migration1702478171814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a132ba8200c3abdc271d4a701d8"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_d88edac9d7990145ff6831a7bb3"`);
        await queryRunner.query(`CREATE TABLE "board" ("id" SERIAL NOT NULL, "title" text NOT NULL, "description" text, "ownerId" integer, CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_boards_board" ("usersId" integer NOT NULL, "boardId" integer NOT NULL, CONSTRAINT "PK_3718865e97f21aab6f8384db2e1" PRIMARY KEY ("usersId", "boardId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0076254de4535938063295cb01" ON "users_boards_board" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_27b33a9a2bd8640d23551af527" ON "users_boards_board" ("boardId") `);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_d88edac9d7990145ff6831a7bb3" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_72a2bd5f275784b6bfa940c0ab6" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_boards_board" ADD CONSTRAINT "FK_0076254de4535938063295cb019" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_boards_board" ADD CONSTRAINT "FK_27b33a9a2bd8640d23551af5278" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_boards_board" DROP CONSTRAINT "FK_27b33a9a2bd8640d23551af5278"`);
        await queryRunner.query(`ALTER TABLE "users_boards_board" DROP CONSTRAINT "FK_0076254de4535938063295cb019"`);
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_72a2bd5f275784b6bfa940c0ab6"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_d88edac9d7990145ff6831a7bb3"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "ownerId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_27b33a9a2bd8640d23551af527"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0076254de4535938063295cb01"`);
        await queryRunner.query(`DROP TABLE "users_boards_board"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_d88edac9d7990145ff6831a7bb3" FOREIGN KEY ("boardId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_a132ba8200c3abdc271d4a701d8" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
