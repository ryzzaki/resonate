import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDBState1596956579711 implements MigrationInterface {
    name = 'InitDBState1596956579711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT timezone('utc', now())`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT timezone('utc'`, undefined);
    }

}
