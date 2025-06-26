"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
async function seed(knex) {
    await knex('patients').del();
    await knex('patients').insert([
        {
            id: '550e8400-e29b-41d4-a716-446655440201',
            nom: 'Diallo',
            prenom: 'Moussa',
            date_naissance: '1985-03-15',
            telephone: '+221 77 234 56 78',
            email: 'moussa.diallo@email.sn',
            adresse: 'Parcelles Assainies, Dakar',
            numero_patient: 'PAT-2024-001',
            hopital_id: '550e8400-e29b-41d4-a716-446655440001',
            medecin_referent_id: '550e8400-e29b-41d4-a716-446655440102'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440202',
            nom: 'Sarr',
            prenom: 'Khady',
            date_naissance: '1992-07-22',
            telephone: '+221 78 345 67 89',
            email: 'khady.sarr@email.sn',
            adresse: 'Medina, Dakar',
            numero_patient: 'PAT-2024-002',
            hopital_id: '550e8400-e29b-41d4-a716-446655440001',
            medecin_referent_id: '550e8400-e29b-41d4-a716-446655440102'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440203',
            nom: 'Gueye',
            prenom: 'Omar',
            date_naissance: '1978-11-08',
            telephone: '+221 76 456 78 90',
            email: 'omar.gueye@email.sn',
            adresse: 'HLM Grand Yoff, Dakar',
            numero_patient: 'PAT-2024-003',
            hopital_id: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440204',
            nom: 'Ndiaye',
            prenom: 'Fatou',
            date_naissance: '1990-05-12',
            telephone: '+221 77 567 89 01',
            email: 'fatou.ndiaye@email.sn',
            adresse: 'Saint-Louis',
            numero_patient: 'PAT-2024-004',
            hopital_id: '550e8400-e29b-41d4-a716-446655440002',
            medecin_referent_id: '550e8400-e29b-41d4-a716-446655440105'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440205',
            nom: 'Diop',
            prenom: 'Mamadou',
            date_naissance: '1983-09-30',
            telephone: '+221 78 678 90 12',
            email: 'mamadou.diop@email.sn',
            adresse: 'Thiès',
            numero_patient: 'PAT-2024-005',
            hopital_id: '550e8400-e29b-41d4-a716-446655440003'
        }
    ]);
}
//# sourceMappingURL=003_patients.js.map