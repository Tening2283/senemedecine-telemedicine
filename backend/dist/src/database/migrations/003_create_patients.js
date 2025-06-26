"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('patients', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('nom').notNullable();
        table.string('prenom').notNullable();
        table.date('date_naissance').notNullable();
        table.string('telephone').notNullable();
        table.string('email');
        table.text('adresse').notNullable();
        table.string('numero_patient').notNullable().unique();
        table.uuid('hopital_id').references('id').inTable('hopitaux').onDelete('CASCADE').notNullable();
        table.uuid('medecin_referent_id').references('id').inTable('users').onDelete('SET NULL');
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('patients');
}
//# sourceMappingURL=003_create_patients.js.map