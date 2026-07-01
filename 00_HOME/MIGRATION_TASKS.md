# Migration Tasks — Plan opérationnel

Objectif : exécuter la refonte CRV par étapes reproductibles.

Phase 1 — Audit de l'existant
- Statut : complété

Phase 2 — Préambule officiel
- Créer `00_HOME/PREAMBULE_CRV.md` (ébauche)
- Valider ton style et ton préambule via PR

Phase 3 — Refonte du Canon (Canon CRV 2.0)
- Consolider les versions du Canon (identifier la source de vérité)
- Créer `CRV/Canon/README.md` et fichiers structurés (Principes, Corollaires, Théorèmes, Glossaire)

Phase 4 — Réorganisation des Fondations (BRM)
- Auditer chaque Fondation
- Réorganiser les fichiers et ajouter des métadonnées (status, version)

Phase 5 — Migration des agents
- Mettre à jour les spécifications dans `15_REDACTION_X/` et `00_HOME/agent_*`
- Tester flows d'agent sur contenus réorganisés

Phase 6 — Publications
- Adapter `10_EXPORTS/` pour consommer `CRV/`
- Tester génération PDF/HTML

Phase 7 — Univers narratif
- Migrer outlines et chapitres vers `CRV/Univers_Narratif`
- Mettre à jour Story Bibles

Notes pratiques
- Chaque sous‑phase doit correspondre à une branche dédiée et une PR.
- Conserver des backups (tags/branches) avant opérations destructrices.
