"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('email').notNullable().unique();
        table.string('nom').notNullable();
        table.string('prenom').notNullable();
        table.enum('role', ['ADMIN', 'MEDECIN', 'SECRETAIRE', 'PATIENT']).notNullable();
        table.uuid('hopital_id').references('id').inTable('hopitaux').onDelete('CASCADE');
        table.string('telephone');
        table.string('specialite');
        table.string('password_hash').notNullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('users');
}
//# sourceMappingURL=002_create_users.js.map