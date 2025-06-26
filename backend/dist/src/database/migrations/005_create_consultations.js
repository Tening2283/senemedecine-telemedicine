"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('consultations', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE').notNullable();
        table.uuid('medecin_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.timestamp('date').notNullable();
        table.text('motif').notNullable();
        table.text('diagnostic');
        table.text('notes');
        table.enum('statut', ['PROGRAMMEE', 'EN_COURS', 'TERMINEE', 'ANNULEE']).defaultTo('PROGRAMMEE');
        table.uuid('hopital_id').references('id').inTable('hopitaux').onDelete('CASCADE').notNullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('consultations');
}
//# sourceMappingURL=005_create_consultations.js.map