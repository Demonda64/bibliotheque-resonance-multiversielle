# Lecteur web - Bibliotheque de la Resonance Multiversielle

Site statique de lecture pour GitHub Pages et lecture locale.

## Ouvrir en local

Depuis la racine du projet `BIBLIOTHEQUE_DE_LA_RESONANCE_MULTIVERSIELLE`:

```powershell
node 12_READER_SITE/server.js
```

Puis ouvrir:

```text
http://localhost:8766/12_READER_SITE/
```

## Publier sur GitHub Pages

La publication utilise la branche `gh-pages`, car l'activation automatique par GitHub Actions n'a pas les permissions necessaires sur ce depot.

1. Pousser le workspace sur GitHub, branche `main`.
2. Synchroniser la branche de publication:

```powershell
git push origin main:gh-pages
```

3. Dans GitHub, ouvrir `Settings > Pages`.
4. Choisir `Deploy from a branch`.
5. Selectionner `gh-pages` et `/ (root)`.
6. Enregistrer.

URL publique prevue:

```text
https://demonda64.github.io/bibliotheque-resonance-multiversielle/
```

Le lecteur charge directement les manuscrits:

```text
../06_CHAPTERS/FONDATION_01_PREFACE_RESUME_TABLE_DES_MATIERES.md
../06_CHAPTERS/FONDATION_01_LIVRE_01_LE_MULTIVERS_INFINI.md
../06_CHAPTERS/FONDATION_01_LIVRE_02_LA_CARTOGRAPHIE_DES_REALITES.md
../06_CHAPTERS/FONDATION_01_LIVRE_03_LES_BRANCHES_DE_L_EXISTENCE.md
../06_CHAPTERS/FONDATION_01_LIVRE_04_POURQUOI_TOUT_EXISTE_QUELQUE_PART.md
../06_CHAPTERS/FONDATION_01_LIVRE_05_LES_LIMITES_DU_POSSIBLE.md
```

La Fondation 1 est complete en premiere passe et dispose maintenant d'une ouverture de lecture: preface, resume et table des matieres.

Note editoriale: le Draft 02 est en cours dans `08_DRAFTS/DRAFT_02.md`. Le lecteur web continue de servir la version publique de travail depuis `06_CHAPTERS` jusqu'a reintegration complete du Draft 02. Les futurs livres de la Fondation 2 devront etre ajoutes dans `12_READER_SITE/app.js`, puis publies sur `main` et `gh-pages`.

## Reference visuelle

Le concept d'interface genere pour guider le design est conserve ici:

```text
12_READER_SITE/design/reader-concept.png
```
