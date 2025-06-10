# Guide de Contribution - SeneMedecine

Merci de votre intérêt pour contribuer à SeneMedecine ! Ce guide vous aidera à comprendre comment participer au développement de cette application de télémédecine.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Signaler des Bugs](#signaler-des-bugs)
- [Proposer des Fonctionnalités](#proposer-des-fonctionnalités)
- [Développement Local](#développement-local)
- [Standards de Code](#standards-de-code)
- [Process de Pull Request](#process-de-pull-request)
- [Tests](#tests)
- [Documentation](#documentation)

## 🤝 Code de Conduite

En participant à ce projet, vous acceptez de respecter notre [Code de Conduite](CODE_OF_CONDUCT.md). Nous nous engageons à maintenir un environnement accueillant et inclusif pour tous.

## 🚀 Comment Contribuer

Il existe plusieurs façons de contribuer à SeneMedecine :

### 🐛 Signaler des Bugs
- Utilisez les [GitHub Issues](https://github.com/votre-org/senemedecine/issues)
- Vérifiez d'abord si le bug n'a pas déjà été signalé
- Utilisez le template de bug report

### 💡 Proposer des Fonctionnalités
- Ouvrez une issue avec le label "enhancement"
- Décrivez clairement la fonctionnalité souhaitée
- Expliquez pourquoi elle serait utile

### 🔧 Contribuer au Code
- Fork le repository
- Créez une branche pour votre fonctionnalité
- Implémentez vos changements
- Ajoutez des tests
- Soumettez une Pull Request

### 📚 Améliorer la Documentation
- Corrigez les erreurs dans la documentation
- Ajoutez des exemples
- Traduisez la documentation
- Améliorez les commentaires du code

## 🐛 Signaler des Bugs

### Avant de Signaler

1. **Vérifiez les issues existantes** pour éviter les doublons
2. **Testez avec la dernière version** du code
3. **Reproduisez le bug** de manière consistante

### Template de Bug Report

```markdown
**Description du Bug**
Une description claire et concise du bug.

**Étapes pour Reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Faire défiler jusqu'à '...'
4. Voir l'erreur

**Comportement Attendu**
Description claire de ce qui devrait se passer.

**Captures d'Écran**
Si applicable, ajoutez des captures d'écran.

**Environnement:**
- OS: [ex. Ubuntu 20.04]
- Navigateur: [ex. Chrome 91]
- Version Node.js: [ex. 18.17.0]
- Version Docker: [ex. 20.10.17]

**Contexte Additionnel**
Toute autre information pertinente.
```

## 💡 Proposer des Fonctionnalités

### Template de Feature Request

```markdown
**Problème à Résoudre**
Description claire du problème que cette fonctionnalité résoudrait.

**Solution Proposée**
Description claire de ce que vous aimeriez voir implémenté.

**Alternatives Considérées**
Description des solutions alternatives que vous avez considérées.

**Contexte Additionnel**
Toute autre information ou capture d'écran pertinente.
```

## 💻 Développement Local

### Prérequis

- Node.js 18+
- Docker et Docker Compose
- Git
- PostgreSQL 15+ (optionnel pour le développement local)

### Configuration Initiale

1. **Fork et Clone**
```bash
git clone https://github.com/votre-username/senemedecine.git
cd senemedecine
```

2. **Installation des Dépendances**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configuration de l'Environnement**
```bash
cp .env.example .env
# Éditez .env selon vos besoins
```

4. **Démarrage avec Docker**
```bash
./start.sh dev
```

5. **Ou Démarrage Manuel**
```bash
# Terminal 1 - Base de données
docker-compose up postgres orthanc

# Terminal 2 - Backend
cd backend
npm run start:dev

# Terminal 3 - Frontend
cd frontend
npm start
```

### Structure du Projet

```
senemedecine/
├── backend/           # API NestJS
├── frontend/          # Interface React
├── database/          # Scripts SQL
├── orthanc/          # Configuration Orthanc
├── nginx/            # Configuration Nginx
├── docs/             # Documentation
├── scripts/          # Scripts utilitaires
└── docker-compose.yml
```

## 📏 Standards de Code

### TypeScript/JavaScript

- **ESLint** et **Prettier** configurés
- **Conventions de nommage** :
  - Variables et fonctions : `camelCase`
  - Classes et interfaces : `PascalCase`
  - Constantes : `UPPER_SNAKE_CASE`
  - Fichiers : `kebab-case` ou `PascalCase` pour les composants

### Backend (NestJS)

```typescript
// ✅ Bon
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  async findAll(@Query() query: FindPatientsDto): Promise<PaginatedResponse<Patient>> {
    return this.patientsService.findAll(query);
  }
}

// ❌ Mauvais
@Controller('patients')
export class patients_controller {
  constructor(private patientsService: PatientsService) {}

  @Get()
  async getPatients(@Query() q: any) {
    return this.patientsService.getAll(q);
  }
}
```

### Frontend (React)

```tsx
// ✅ Bon
interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onEdit }) => {
  const handleEditClick = useCallback(() => {
    onEdit(patient);
  }, [patient, onEdit]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold">{patient.fullName}</h3>
      <button onClick={handleEditClick}>Modifier</button>
    </div>
  );
};

// ❌ Mauvais
const patientCard = (props) => {
  return (
    <div style={{background: 'white', padding: '16px'}}>
      <h3>{props.patient.firstName} {props.patient.lastName}</h3>
      <button onClick={() => props.onEdit(props.patient)}>Edit</button>
    </div>
  );
};
```

### CSS/Tailwind

- Utilisez **Tailwind CSS** pour le styling
- Évitez les styles inline sauf cas exceptionnels
- Groupez les classes logiquement

```tsx
// ✅ Bon
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">

// ❌ Mauvais
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out border border-gray-200">
```

### Base de Données

- Utilisez des **migrations** pour tous les changements de schéma
- Nommage des tables : `snake_case` au pluriel
- Nommage des colonnes : `snake_case`
- Toujours ajouter des index sur les clés étrangères

## 🔄 Process de Pull Request

### 1. Préparation

1. **Créez une branche** depuis `main`
```bash
git checkout -b feature/nouvelle-fonctionnalite
```

2. **Nommage des branches** :
   - `feature/description` pour les nouvelles fonctionnalités
   - `fix/description` pour les corrections de bugs
   - `docs/description` pour la documentation
   - `refactor/description` pour le refactoring

### 2. Développement

1. **Commits atomiques** avec des messages clairs
2. **Suivez les conventions** de commit :
```
type(scope): description

feat(auth): add JWT refresh token mechanism
fix(patients): resolve duplicate patient number issue
docs(api): update authentication endpoints documentation
```

3. **Types de commits** :
   - `feat`: Nouvelle fonctionnalité
   - `fix`: Correction de bug
   - `docs`: Documentation
   - `style`: Formatage, point-virgules manquants, etc.
   - `refactor`: Refactoring du code
   - `test`: Ajout de tests
   - `chore`: Maintenance

### 3. Tests

Assurez-vous que tous les tests passent :

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Frontend
cd frontend
npm test
```

### 4. Soumission

1. **Push votre branche**
```bash
git push origin feature/nouvelle-fonctionnalite
```

2. **Créez la Pull Request** sur GitHub

3. **Template de PR** :
```markdown
## Description
Brève description des changements.

## Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration ajoutés/mis à jour
- [ ] Tests manuels effectués

## Checklist
- [ ] Code suit les standards du projet
- [ ] Auto-review effectuée
- [ ] Documentation mise à jour
- [ ] Pas de conflits avec main
```

### 5. Review Process

1. **Review automatique** par les maintainers
2. **Tests CI/CD** doivent passer
3. **Au moins une approbation** requise
4. **Merge** après approbation

## 🧪 Tests

### Tests Unitaires

```typescript
// Backend - Example
describe('PatientsService', () => {
  let service: PatientsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PatientsService],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should create a patient', async () => {
    const patientDto = { firstName: 'John', lastName: 'Doe' };
    const result = await service.create(patientDto);
    
    expect(result).toBeDefined();
    expect(result.firstName).toBe('John');
  });
});
```

```tsx
// Frontend - Example
import { render, screen } from '@testing-library/react';
import PatientCard from './PatientCard';

test('renders patient name', () => {
  const patient = { id: '1', firstName: 'John', lastName: 'Doe' };
  
  render(<PatientCard patient={patient} onEdit={jest.fn()} />);
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Tests d'Intégration

```typescript
describe('Patients API', () => {
  it('should create and retrieve a patient', async () => {
    const patientData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com'
    };

    const createResponse = await request(app)
      .post('/api/v1/patients')
      .send(patientData)
      .expect(201);

    const patientId = createResponse.body.id;

    const getResponse = await request(app)
      .get(`/api/v1/patients/${patientId}`)
      .expect(200);

    expect(getResponse.body.firstName).toBe('Jane');
  });
});
```

## 📚 Documentation

### Code Documentation

- **JSDoc** pour les fonctions complexes
- **Commentaires** pour la logique métier
- **README** pour chaque module important

```typescript
/**
 * Calcule l'âge d'un patient à partir de sa date de naissance
 * @param dateOfBirth - Date de naissance du patient
 * @returns Âge en années
 */
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
```

### API Documentation

- Utilisez **Swagger/OpenAPI** pour documenter l'API
- Ajoutez des exemples de requêtes/réponses
- Documentez les codes d'erreur

```typescript
@ApiOperation({ 
  summary: 'Create a new patient',
  description: 'Creates a new patient record in the system'
})
@ApiResponse({ 
  status: 201, 
  description: 'Patient created successfully',
  type: Patient 
})
@ApiResponse({ 
  status: 400, 
  description: 'Invalid input data' 
})
@Post()
async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
  return this.patientsService.create(createPatientDto);
}
```

## 🏷️ Versioning

Nous suivons [Semantic Versioning](https://semver.org/) :

- **MAJOR** : Changements incompatibles
- **MINOR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs compatibles

## 🎉 Reconnaissance

Les contributeurs sont reconnus dans :

- Le fichier [CONTRIBUTORS.md](CONTRIBUTORS.md)
- Les release notes
- Le README principal

## 📞 Support

Si vous avez des questions :

- **GitHub Discussions** pour les questions générales
- **GitHub Issues** pour les bugs et fonctionnalités
- **Email** : dev@senemedecine.sn

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient sous la même licence que le projet (MIT).

---

Merci de contribuer à SeneMedecine ! Ensemble, nous révolutionnons la santé au Sénégal 🇸🇳

