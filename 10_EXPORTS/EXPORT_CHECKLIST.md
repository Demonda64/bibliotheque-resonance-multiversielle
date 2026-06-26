# EXPORT CHECKLIST

## Avant Export
- [x] Titre confirme
- [x] Chapitres dans le bon ordre pour les cinq livres de la Fondation 1
- [ ] Draft 02 assemble
- [ ] Line edit termine
- [x] Continuite verifiee apres fin de la Fondation 1
- [ ] Notes internes supprimees
- [ ] Orthographe relue
- [x] Format web choisi pour lecture publique
- [x] Brief couverture pret
- [ ] Couverture generee avec ChatGPT Image 2 / GPT Image 2
- [ ] Titre et auteur verifies sur la couverture
- [x] Depot GitHub cree et pousse
- [x] Branche `gh-pages` preparee
- [ ] GitHub Pages active dans `Settings > Pages`
- [ ] URL publique verifiee

## Formats
- [x] Markdown
- [ ] DOCX
- [ ] PDF
- [x] PDF ebook Fondation 1
- [ ] EPUB
- [ ] Cover ebook
- [ ] Cover print
- [ ] Cover social
- [x] Lecteur web statique

## Fondation 1
| Livre | Statut export |
| --- | --- |
| Le Multivers Infini | Livre 1 complet et mini-relu en Draft 02 |
| La Cartographie des Realites | Chapitres 1 a 3 ajoutes en Draft 02 |
| Les Branches de l'Existence | Pret pour relecture Draft 2 |
| Pourquoi Tout Existe Quelque Part | Pret pour relecture Draft 2 |
| Les Limites du Possible | Pret pour relecture Draft 2 |

## Blocages Restants
- Terminer le Draft 02 avant generation de l'interieur print final.
- Activer ou verifier GitHub Pages depuis `Settings > Pages`.
- Produire une version assemblee print A5 pour TheBookEdition.
- Generer et valider une couverture finale.
- Faire une passe de correction orthographique et typographique avant diffusion large.
- Glossaire Fondation 1 cree; bibliographie encore a creer avant publication.
- Commander un exemplaire test avant lancement public.

## TheBookEdition
| Phase | Objectif | Statut |
| --- | --- | --- |
| 1 | Geler le manuscrit | En attente Draft 02 |
| 2 | Preparer pages liminaires, glossaire, bibliographie | En cours |
| 3 | Mise en page A5 print | A faire |
| 4 | Couverture sobre | A faire |
| 5 | Publication TheBookEdition | A faire |
| 6 | Exemplaire test | A faire |
| 7 | Lancement | A faire |

## Export PDF Fondation 1
Fichier final:

`10_EXPORTS/pdf/fondation_01_le_multivers_ebook.pdf`

Source imprimable:

`10_EXPORTS/pdf/fondation_01_le_multivers.html`

Generation:

`node 10_EXPORTS/build_fondation_01_html_pdf.js`

Notes de controle:
- PDF genere par Chrome headless depuis HTML imprime.
- Apercu HTML verifie visuellement via `fondation_01_html_preview.png`.
- Rendu direct du PDF en PNG indisponible dans cet environnement: Chrome headless affiche le viewer PDF en noir; Poppler/Ghostscript/MuPDF ne sont pas installes.
