"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('consultation_medicaments', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('consultation_id').references('id').inTable('consultations').onDelete('CASCADE').notNullable();
        table.uuid('medicament_id').references('id').inTable('medicaments').onDelete('CASCADE').notNullable();
        table.text('posologie');
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('consultation_medicaments');
}
//# sourceMappingURL=006_create_consultation_medicaments.js.map