import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCategoryTable1654361199890
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const categoryTable = new Table({
      name: 'categories',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'title',
          type: 'varchar',
        },
        {
          name: 'created_at',
          type: 'timestamp with time zone',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp with time zone',
          default: 'now()',
        },
      ],
    });
    await queryRunner.createTable(categoryTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories');
  }
}
