"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('hopitaux', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('nom').notNullable();
        table.text('adresse').notNullable();
        table.string('telephone').notNullable();
        table.string('email').notNullable().unique();
        table.string('ville').notNullable();
        table.boolean('actif').defaultTo(true);
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('hopitaux');
}
//# sourceMappingURL=001_create_hopitaux.js.map