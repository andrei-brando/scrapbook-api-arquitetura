import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableNotes1626220541213 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'notes',
      columns: [
        {
          name: 'uid',
          type: 'uuid',
          isPrimary: true,
          isNullable: false,
        },
        {
          name: 'description',
          type: 'varchar',
          length: '50',
          isNullable: false,
        },
        {
          name: 'details',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'user_uid',
          type: 'uuid',
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          isNullable: false,
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          isNullable: false,
        },
      ],
      foreignKeys: [
        new TableForeignKey({
          columnNames: ['user_uid'],
          referencedTableName: 'users',
          referencedColumnNames: ['uid'],
        }),
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notes');
  }

}
