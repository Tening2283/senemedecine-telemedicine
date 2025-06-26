import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Supprimer les données existantes
  await knex('medicaments').del();

  // Insérer les données
  await knex('medicaments').insert([
    {
      id: '550e8400-e29b-41d4-a716-446655440301',
      nom: 'Amoxicilline',
      dosage: '500mg',
      frequence: '3 fois par jour',
      duree: '7 jours',
      instructions: 'À prendre avec les repas'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440302',
      nom: 'Paracétamol',
      dosage: '1000mg',
      frequence: '3 fois par jour',
      duree: '5 jours',
      instructions: 'En cas de douleur ou fièvre'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440303',
      nom: 'Ibuprofène',
      dosage: '400mg',
      frequence: '2 fois par jour',
      duree: '3 jours',
      instructions: 'À prendre avec de la nourriture'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440304',
      nom: 'Oméprazole',
      dosage: '20mg',
      frequence: '1 fois par jour',
      duree: '14 jours',
      instructions: 'À jeun, 30 minutes avant le petit-déjeuner'
    }
  ]);
} 