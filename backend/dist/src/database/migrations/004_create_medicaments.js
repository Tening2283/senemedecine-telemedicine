"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('medicaments', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('nom').notNullable();
        table.string('dosage').notNullable();
        table.string('frequence').notNullable();
        table.string('duree').notNullable();
        table.text('instructions');
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('medicaments');
}
//# sourceMappingURL=004_create_medicaments.js.map