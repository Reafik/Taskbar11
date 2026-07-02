# Guide d'Import Figma par URL

Ce guide explique comment importer et documenter votre design system Figma automatiquement en utilisant l'URL du fichier.

## Vue d'ensemble

La fonctionnalité d'import par URL permet de :
- Analyser automatiquement un fichier Figma
- Extraire tous les design tokens (variables)
- Importer la structure du design system
- Ajouter du contexte à chaque token

## Prérequis

### Pour les fichiers publics
Aucune configuration nécessaire ! Collez simplement l'URL.

### Pour les fichiers privés
Vous aurez besoin d'un **Personal Access Token** Figma :

1. Connectez-vous à Figma
2. Allez dans **Settings** → **Account**
3. Scrollez jusqu'à **Personal Access Tokens**
4. Cliquez sur **Create new token**
5. Donnez un nom au token (ex: "Design Context Pro")
6. Copiez le token (il commence par `figd_`)

**Important** : Conservez ce token en sécurité, il donne accès à vos fichiers Figma.

## Utilisation

### Étape 1 : Obtenir l'URL de votre fichier Figma

1. Ouvrez votre fichier de design system dans Figma
2. Copiez l'URL depuis la barre d'adresse

Exemples d'URLs supportées :
```
https://www.figma.com/file/abc123xyz/My-Design-System
https://www.figma.com/design/abc123xyz/My-Design-System
```

### Étape 2 : Importer dans Design Context Pro

1. Ouvrez l'application web (`http://localhost:3000`)
2. Cliquez sur le bouton **"Import from Figma"** dans la navigation
3. Dans le formulaire :
   - **Figma File URL** : Collez l'URL de votre fichier
   - **Figma Personal Access Token** : (Optionnel) Collez votre token si le fichier est privé
4. Cliquez sur **"Analyze Design System"**

### Étape 3 : Attendez l'analyse

Le système va :
1. Se connecter à l'API Figma
2. Récupérer les métadonnées du fichier
3. Extraire toutes les variables (design tokens)
4. Organiser les tokens par collections
5. Générer la syntaxe de code pour chaque plateforme

Cela prend généralement 5-10 secondes.

### Étape 4 : Explorer vos tokens

Après l'import, vous serez redirigé vers la page du projet où vous pouvez :
- Voir le nombre total de tokens extraits
- Cliquer sur **"View Design Tokens"** pour explorer

## Types de tokens extraits

Design Context Pro extrait automatiquement tous les types de variables Figma :

### 🎨 Colors (Couleurs)
- Couleurs de marque
- Couleurs sémantiques
- Palettes de couleurs
- **Format** : Hexadécimal avec alpha

### 📏 Numbers (Nombres)
- Espacements (spacing)
- Tailles de bordure (border-radius)
- Opacité
- Autres valeurs numériques

### 🔤 Strings (Texte)
- Noms de polices
- Valeurs de texte
- Identifiants

### ✓ Booleans
- Feature flags
- États on/off

## Ajouter du contexte aux tokens

### Navigation

1. Cliquez sur **"View Design Tokens"** depuis la page du projet
2. Utilisez la barre latérale pour naviguer entre les collections
3. Cliquez sur un token pour voir ses détails
4. Le panneau de droite affiche toutes les informations

### Édition du contexte

1. Dans le panneau de détails, cliquez sur **"Edit Context"**
2. Remplissez les champs :
   - **Description** : Décrivez ce que représente ce token
     - Exemple : "Couleur principale de la marque, utilisée pour les CTAs"
   - **Usage** : Expliquez quand et comment l'utiliser
     - Exemple : "À utiliser pour tous les boutons primaires, liens importants, et éléments interactifs principaux"
3. Cliquez sur **"Save"**

### Syntaxe de code

Chaque token affiche automatiquement la syntaxe pour :

#### CSS/Web
```css
var(--brand-primary-500)
```

#### iOS/Swift
```swift
.brandPrimary500
```

#### Android
```kotlin
R.color.brand_primary_500
```

## Bonnes pratiques

### Organisation des tokens

1. **Utilisez des noms descriptifs** dans Figma
   - ✅ `color/brand/primary/500`
   - ❌ `color1`

2. **Organisez par collections**
   - Créez des collections pour : Colors, Typography, Spacing, etc.

3. **Utilisez les modes**
   - Light/Dark
   - Desktop/Mobile
   - Default/High Contrast

### Documentation des tokens

1. **Description** : Soyez concis mais précis
   - Décrivez ce que c'est, pas comment l'utiliser
   - Exemple : "Couleur d'arrière-plan pour les surfaces élevées"

2. **Usage** : Donnez des exemples concrets
   - Quand utiliser ce token
   - Exemples de composants
   - Cas d'usage recommandés

3. **Évitez les répétitions**
   - Si le nom du token est déjà clair, concentrez-vous sur des informations additionnelles

## Synchronisation et mises à jour

### Re-synchroniser un projet existant

Si votre fichier Figma a changé (nouveaux tokens, modifications) :

1. Retournez sur la page **"Import from Figma"**
2. Collez la même URL
3. Le système va **mettre à jour** le projet existant
4. Les nouveaux tokens seront ajoutés
5. Les tokens modifiés seront mis à jour
6. **Le contexte existant est préservé**

### Fréquence de synchronisation recommandée

- **Après des changements majeurs** : Immédiatement
- **Sprint/Release** : À chaque fin de sprint
- **Régulièrement** : Une fois par semaine pour les équipes actives

## Résolution de problèmes

### "Invalid Figma URL"
- Vérifiez que l'URL commence par `https://www.figma.com/file/` ou `/design/`
- Assurez-vous que l'URL contient bien le fileKey

### "Unauthorized" ou "403 Forbidden"
- Le fichier est probablement privé
- Ajoutez votre Personal Access Token
- Vérifiez que le token n'a pas expiré

### "No variables found"
- Le fichier n'a peut-être pas de variables Figma
- Vérifiez dans Figma : Menu → Variables
- Créez des variables si nécessaire

### "Failed to analyze"
- Vérifiez votre connexion internet
- Vérifiez que le serveur backend est démarré
- Consultez les logs du serveur pour plus de détails

## Configuration du serveur (Pour les développeurs)

### Variable d'environnement

Pour un serveur public, configurez un token Figma par défaut :

```env
FIGMA_ACCESS_TOKEN=figd_your_token_here
```

Cela permet :
- L'import de fichiers publics sans token utilisateur
- L'accès aux fichiers de l'équipe avec permissions
- Un point d'entrée unique pour tous les utilisateurs

### Sécurité

- **Ne partagez jamais** votre Personal Access Token
- **Ne committez pas** le token dans Git
- Utilisez des variables d'environnement
- Considérez l'utilisation de secrets management (Vault, AWS Secrets Manager, etc.)

## Intégration avec l'équipe

### Workflow recommandé

1. **Designer** : Crée et maintient les tokens dans Figma
2. **Design Ops** : Importe et documente les tokens dans Design Context Pro
3. **Développeurs** : Consultent la documentation et utilisent les syntaxes de code
4. **Tous** : Peuvent chercher et consulter la documentation

### Partage

- Partagez l'URL du projet : `http://your-domain.com/project/{fileKey}`
- Les tokens sont consultables sans authentification (par défaut)
- Seule l'édition nécessite une clé API

## Exemples d'utilisation

### Exemple 1 : Palette de couleurs complète

1. Créez vos couleurs comme variables dans Figma
2. Organisez en collection "Brand Colors"
3. Importez dans Design Context Pro
4. Documentez chaque couleur :
   - Primary : "Couleur principale, utilisée pour les actions primaires"
   - Secondary : "Couleur secondaire, pour les actions moins importantes"
   - Success : "Pour les messages de succès et états positifs"
   - etc.

### Exemple 2 : Système de spacing

1. Créez des variables numériques pour les espacements
2. Collection "Spacing" avec : xs, sm, md, lg, xl, 2xl
3. Importez et documentez :
   - xs (4px) : "Espacement minimum entre éléments inline"
   - sm (8px) : "Espacement standard entre éléments"
   - md (16px) : "Espacement entre sections"
   - etc.

### Exemple 3 : Typography scale

1. Variables pour font-size, line-height, font-weight
2. Collections : "Font Size", "Line Height", "Font Weight"
3. Documentation avec exemples d'usage pour chaque taille

## Support et ressources

- [Documentation Figma API](https://www.figma.com/developers/api)
- [Variables Figma](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [README du projet](../README.md)
- [Guide de démarrage rapide](../QUICKSTART.md)

## FAQ

**Q : Puis-je importer plusieurs fichiers Figma ?**
R : Oui ! Chaque fichier devient un projet séparé dans l'application.

**Q : Les tokens sont-ils synchronisés en temps réel ?**
R : Non, vous devez re-lancer l'import pour mettre à jour. Une synchronisation automatique est prévue dans une future version.

**Q : Que se passe-t-il si je supprime un token dans Figma ?**
R : Il restera dans Design Context Pro jusqu'à la prochaine synchronisation. La suppression automatique n'est pas encore implémentée.

**Q : Puis-je exporter mes tokens documentés ?**
R : Pas encore, mais l'export en JSON, Markdown et Style Dictionary est prévu.

**Q : Est-ce que cela fonctionne avec FigJam ?**
R : Non, seuls les fichiers Figma Design sont supportés actuellement.
