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
../06_CHAPTERS/FONDATION_01_LIVRE_01_LE_MULTIVERS_INFINI.md
../06_CHAPTERS/FONDATION_01_LIVRE_02_LA_CARTOGRAPHIE_DES_REALITES.md
../06_CHAPTERS/FONDATION_01_LIVRE_03_LES_BRANCHES_DE_L_EXISTENCE.md
```

Les futurs chapitres ajoutes aux manuscrits apparaitront apres rechargement de la page et repush sur `gh-pages`.

## Reference visuelle

Le concept d'interface genere pour guider le design est conserve ici:

```text
12_READER_SITE/design/reader-concept.png
```
