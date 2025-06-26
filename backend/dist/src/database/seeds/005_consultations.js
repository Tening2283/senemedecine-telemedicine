"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
async function seed(knex) {
    await knex('consultations').del();
    await knex('consultations').insert([
        {
            id: '550e8400-e29b-41d4-a716-446655440401',
            patient_id: '550e8400-e29b-41d4-a716-446655440201',
            medecin_id: '550e8400-e29b-41d4-a716-446655440102',
            date: '2024-01-15T10:30:00Z',
            motif: 'Douleurs thoraciques',
            diagnostic: 'Angine de poitrine stable',
            notes: 'Patient présentant des douleurs thoraciques à l\'effort. ECG normal au repos.',
            statut: 'TERMINEE',
            hopital_id: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440402',
            patient_id: '550e8400-e29b-41d4-a716-446655440202',
            medecin_id: '550e8400-e29b-41d4-a716-446655440102',
            date: '2024-01-16T14:00:00Z',
            motif: 'Contrôle de routine',
            diagnostic: 'État général satisfaisant',
            notes: 'Contrôle de routine, tension artérielle normale.',
            statut: 'TERMINEE',
            hopital_id: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440403',
            patient_id: '550e8400-e29b-41d4-a716-446655440203',
            medecin_id: '550e8400-e29b-41d4-a716-446655440102',
            date: '2024-01-20T09:00:00Z',
            motif: 'Fièvre et toux',
            diagnostic: 'Infection respiratoire',
            notes: 'Patient avec fièvre à 38.5°C et toux sèche depuis 3 jours.',
            statut: 'PROGRAMMEE',
            hopital_id: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440404',
            patient_id: '550e8400-e29b-41d4-a716-446655440204',
            medecin_id: '550e8400-e29b-41d4-a716-446655440105',
            date: '2024-01-18T11:00:00Z',
            motif: 'Examen radiologique',
            diagnostic: 'Radiographie thoracique normale',
            notes: 'Examen radiologique de contrôle, pas d\'anomalie détectée.',
            statut: 'TERMINEE',
            hopital_id: '550e8400-e29b-41d4-a716-446655440002'
        }
    ]);
}
//# sourceMappingURL=005_consultations.js.map