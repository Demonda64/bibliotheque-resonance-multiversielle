# CRV Manifest — Cartographie et correspondances

But : formaliser la nouvelle architecture CRV et indiquer la correspondance avec l'organisation actuelle du dépôt.

Architecture CRV (officielle)
-----------------------------
- Canon Officiel (CRV/Canon)
- Bibliothèque de la Résonance Multiversielle (BRM) — corpus fondateur (CRV/BRM)
- Laboratoire CRV (CRV/Laboratoire)
- Publications (CRV/Publications)
- Univers narratif (CRV/Univers_Narratif)
- Communication (CRV/Communication)

Correspondances avec l'arborescence actuelle
-------------------------------------------
- `02_STORY_BIBLE/` -> `CRV/Canon` (après consolidation)
- `06_CHAPTERS/`, `05_OUTLINE/` -> `CRV/Univers_Narratif`
- `10_EXPORTS/`, `12_READER_SITE/` -> `CRV/Publications`
- `01_CONCEPT/`, `02_STORY_BIBLE/` (glossaire, théorie) -> `CRV/Laboratoire` (recherche et expérimentations)
- `13_ARTICLES_PUBLICS/`, `11_COVER/` -> `CRV/Communication`
- Les dix Fondations (dans `06_CHAPTERS/` et `02_STORY_BIBLE/`) -> `CRV/BRM`

Remarques
--------
- Ce manifeste est un plan de haut niveau. Les fichiers ne sont pas déplacés automatiquement : la migration se fera par étapes contrôlées.
- Chaque étape doit être validée et documentée (commit + PR recommandé).

Prochaine action immédiate : créer le Préambule officiel de la CRV et une checklist de migration (phase 2).
