import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1693479648088 implements MigrationInterface {
    name = 'Initial1693479648088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_6a9775008add570dc3e5a0bab7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`is_public\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_fca3cb9ba4963678f564f22e7a\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article_tags_tag\` (\`articleId\` int NOT NULL, \`tagId\` int NOT NULL, INDEX \`IDX_9b7dd28292e2799512cd70bfd8\` (\`articleId\`), INDEX \`IDX_5fee2a10f8d6688bd2f2c50f15\` (\`tagId\`), PRIMARY KEY (\`articleId\`, \`tagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`article_tags_tag\` ADD CONSTRAINT \`FK_9b7dd28292e2799512cd70bfd81\` FOREIGN KEY (\`articleId\`) REFERENCES \`article\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`article_tags_tag\` ADD CONSTRAINT \`FK_5fee2a10f8d6688bd2f2c50f15e\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article_tags_tag\` DROP FOREIGN KEY \`FK_5fee2a10f8d6688bd2f2c50f15e\``);
        await queryRunner.query(`ALTER TABLE \`article_tags_tag\` DROP FOREIGN KEY \`FK_9b7dd28292e2799512cd70bfd81\``);
        await queryRunner.query(`DROP INDEX \`IDX_5fee2a10f8d6688bd2f2c50f15\` ON \`article_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_9b7dd28292e2799512cd70bfd8\` ON \`article_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`article_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_fca3cb9ba4963678f564f22e7a\` ON \`article\``);
        await queryRunner.query(`DROP TABLE \`article\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a9775008add570dc3e5a0bab7\` ON \`tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
    }

}
