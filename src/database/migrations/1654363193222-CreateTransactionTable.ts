import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateTransactionTable1654363193222
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const transactionTable = new Table({
      name: 'transactions',
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
          name: 'type',
          type: 'varchar',
          enum: ['income', 'outcome'],
        },
        {
          name: 'value',
          type: 'int',
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
    await queryRunner.createTable(transactionTable);

    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'CategoryForeignKey',
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'CategoryForeignKey');

    await queryRunner.dropColumn('transactions', 'category_id');

    await queryRunner.dropTable('transactions');
  }
}
