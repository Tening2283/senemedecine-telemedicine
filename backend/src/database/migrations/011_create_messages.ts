import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('sender_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('receiver_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('consultation_id').nullable().references('id').inTable('consultations').onDelete('SET NULL');
    table.text('content').notNullable();
    table.boolean('read').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('messages');
} 