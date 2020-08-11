import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDBState1597170153676 implements MigrationInterface {
    name = 'InitDBState1597170153676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT timezone('utc', now()), "email" character varying NOT NULL, "userName" character varying NOT NULL, "displayName" character varying NOT NULL, "country" character varying NOT NULL, "subscription" character varying NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "tokenVer" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
