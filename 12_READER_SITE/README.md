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

Un workflow GitHub Actions est disponible dans `.github/workflows/pages.yml`.

1. Pousser le workspace sur GitHub, branche `main`.
2. Dans GitHub, ouvrir `Settings > Pages`.
3. Choisir `GitHub Actions` comme source de publication.
4. Le workflow publie le dossier `PROJECTS/BIBLIOTHEQUE_DE_LA_RESONANCE_MULTIVERSIELLE`.

Le lecteur charge directement:

```text
../06_CHAPTERS/FONDATION_01_LIVRE_01_LE_MULTIVERS_INFINI.md
```

Les futurs chapitres ajoutes au manuscrit apparaitront apres rechargement de la page.

## Reference visuelle

Le concept d'interface genere pour guider le design est conserve ici:

```text
12_READER_SITE/design/reader-concept.png
```
