"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('rendez_vous', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE').notNullable();
        table.uuid('medecin_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.date('date').notNullable();
        table.time('heure').notNullable();
        table.text('motif').notNullable();
        table.enum('statut', ['CONFIRME', 'EN_ATTENTE', 'ANNULE']).defaultTo('EN_ATTENTE');
        table.uuid('hopital_id').references('id').inTable('hopitaux').onDelete('CASCADE').notNullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('rendez_vous');
}
//# sourceMappingURL=007_create_rendez_vous.js.map