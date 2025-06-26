"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
async function seed(knex) {
    await knex('hopitaux').del();
    await knex('hopitaux').insert([
        {
            id: '550e8400-e29b-41d4-a716-446655440001',
            nom: 'Hôpital Principal de Dakar',
            adresse: 'Avenue Cheikh Anta Diop, Dakar',
            telephone: '+221 33 889 92 60',
            email: 'contact@hopital-dakar.sn',
            ville: 'Dakar',
            actif: true
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440002',
            nom: 'Centre Hospitalier de Saint-Louis',
            adresse: 'Rue Abdoulaye Mar Diop, Saint-Louis',
            telephone: '+221 33 961 15 51',
            email: 'info@ch-stlouis.sn',
            ville: 'Saint-Louis',
            actif: true
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440003',
            nom: 'Hôpital Régional de Thiès',
            adresse: 'Route de Mbour, Thiès',
            telephone: '+221 33 951 11 18',
            email: 'direction@hr-thies.sn',
            ville: 'Thiès',
            actif: true
        }
    ]);
}
//# sourceMappingURL=001_hopitaux.js.map