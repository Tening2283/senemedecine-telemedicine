module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nouvelle fonctionnalité
        'fix',      // Correction de bug
        'docs',     // Documentation
        'style',    // Formatage, point-virgules manquants, etc.
        'refactor', // Refactoring du code
        'perf',     // Amélioration des performances
        'test',     // Ajout de tests
        'chore',    // Maintenance
        'ci',       // Changements CI/CD
        'build',    // Changements du système de build
        'revert',   // Revert d'un commit précédent
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
  prompt: {
    questions: {
      type: {
        description: "Sélectionnez le type de changement que vous commitez",
        enum: {
          feat: {
            description: 'Une nouvelle fonctionnalité',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'Une correction de bug',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: 'Changements de documentation uniquement',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: 'Changements qui n\'affectent pas le sens du code (espaces, formatage, point-virgules manquants, etc)',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: 'Un changement de code qui ne corrige pas de bug ni n\'ajoute de fonctionnalité',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: 'Un changement de code qui améliore les performances',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: 'Ajout de tests manquants ou correction de tests existants',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: 'Changements qui affectent le système de build ou les dépendances externes (exemples de scopes: gulp, broccoli, npm)',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: 'Changements de nos fichiers et scripts de configuration CI (exemples de scopes: Travis, Circle, BrowserStack, SauceLabs)',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: "Autres changements qui ne modifient pas les fichiers src ou test",
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: 'Reverts un commit précédent',
            title: 'Reverts',
            emoji: '🗑',
          },
        },
      },
      scope: {
        description: 'Quel est le scope de ce changement (ex. composant ou nom de fichier)',
      },
      subject: {
        description: 'Écrivez une description courte et impérative du changement',
      },
      body: {
        description: 'Fournissez une description plus détaillée du changement',
      },
      isBreaking: {
        description: 'Y a-t-il des changements breaking?',
      },
      breakingBody: {
        description: 'Un commit BREAKING CHANGE nécessite un body. Veuillez entrer une description plus longue du commit lui-même',
      },
      breaking: {
        description: 'Décrivez les changements breaking',
      },
      isIssueAffected: {
        description: 'Ce changement affecte-t-il des issues ouvertes?',
      },
      issuesBody: {
        description: 'Si les issues sont fermées, le commit nécessite un body. Veuillez entrer une description plus longue du commit lui-même',
      },
      issues: {
        description: 'Ajoutez les références des issues (ex. "fix #123", "re #123".)',
      },
    },
  },
};

