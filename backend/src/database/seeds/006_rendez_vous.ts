import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Supprimer les données existantes
  await knex('rendez_vous').del();

  // Insérer les données
  await knex('rendez_vous').insert([
    {
      id: '550e8400-e29b-41d4-a716-446655440501',
      patient_id: '550e8400-e29b-41d4-a716-446655440201',
      medecin_id: '550e8400-e29b-41d4-a716-446655440102',
      date: '2024-01-20',
      heure: '09:00',
      motif: 'Suivi cardiologique',
      statut: 'CONFIRME',
      hopital_id: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440502',
      patient_id: '550e8400-e29b-41d4-a716-446655440203',
      medecin_id: '550e8400-e29b-41d4-a716-446655440102',
      date: '2024-01-20',
      heure: '10:30',
      motif: 'Première consultation',
      statut: 'EN_ATTENTE',
      hopital_id: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440503',
      patient_id: '550e8400-e29b-41d4-a716-446655440202',
      medecin_id: '550e8400-e29b-41d4-a716-446655440102',
      date: '2024-01-22',
      heure: '14:00',
      motif: 'Contrôle tension artérielle',
      statut: 'CONFIRME',
      hopital_id: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440504',
      patient_id: '550e8400-e29b-41d4-a716-446655440204',
      medecin_id: '550e8400-e29b-41d4-a716-446655440105',
      date: '2024-01-25',
      heure: '11:00',
      motif: 'Examen radiologique',
      statut: 'CONFIRME',
      hopital_id: '550e8400-e29b-41d4-a716-446655440002'
    }
  ]);
} 