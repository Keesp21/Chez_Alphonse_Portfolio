# Projet Chez Alphonse

Ce projet est une interface numérique conçue pour le restaurant **Chez Alphonse**, permettant de mettre à jour la carte du jour en temps réel via une interface d'administration. Le site est optimisé pour un affichage multilingue et une synchronisation instantanée entre tous les appareils connectés.

---

## 1. Contexte

Travaillant comme serveur au sein du restaurant Chez Alphonse, j'ai identifié une difficulté récurrente : le besoin de modifier plusieurs fois l'ardoise en plein service, en raison de la forte rotation des produits frais. Ce projet a été conçu comme une solution concrète à ce problème terrain. Il permet de simplifier la communication client, tout en facilitant l’organisation de l’équipe en salle.

---

## 2. Architecture technique

| Composant       | Technologie                  |
|-----------------|------------------------------|
| Frontend        | React + Vite                 |
| Base de données | Supabase (PostgreSQL)        |
| Hébergement     | Vercel                       |
| Traduction      | API DeepSeek via OpenRouter  |
| Realtime        | Supabase Realtime (WebSocket)|

---

## 3. Fonctionnalités clés

### Interface publique
- Affichage dynamique des plats par catégorie (`entrées`, `plats`, `desserts`)
- Traductions automatiques en :
  - Français
  - Anglais
  - Espagnol
  - Japonais
  - Chinois simplifié
- Actualisation automatique toutes les 20 secondes
- Synchronisation instantanée via Supabase Realtime

### Interface administrateur
- Connexion protégée par mot de passe
- Ajout de plats avec nom, description, prix, catégorie
- Traduction automatique à l’enregistrement
- Édition ou suppression de n’importe quel plat
- Toasts de retour utilisateur (confirmation, erreurs)
- Prévisualisation multilingue avant validation

### Traduction IA
- Utilisation du modèle `deepseek/deepseek-chat` via OpenRouter
- Une seule requête d’API DeepSeek par ajout ou modification
- Résultat stocké directement dans Supabase (`nom_xx`, `description_xx`)

### Realtime
- Activation de Supabase Realtime sur la table `menu`
- Propagation immédiate de chaque modification aux utilisateurs
- Fallback automatique via localStorage si la synchro échoue

---

## 4. Configuration Supabase

### a. Créer la table

```sql
CREATE TABLE menu (
  id BIGSERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  prix TEXT NOT NULL,
  categorie TEXT NOT NULL CHECK (categorie IN ('entrees', 'plats', 'desserts')),
  nom_en TEXT,
  nom_es TEXT,
  nom_jp TEXT,
  nom_zh TEXT,
  description_en TEXT,
  description_es TEXT,
  description_jp TEXT,
  description_zh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON menu
  FOR SELECT USING (true);

CREATE POLICY "Allow public write access" ON menu
  FOR ALL USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE menu;
```

### b. Variables à ajouter

Créer un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://<votre-projet>.supabase.co
VITE_SUPABASE_ANON_KEY=<votre-clé-anonyme>
VITE_OPENROUTER_API_KEY=<votre-clé-openrouter>
```

---

## 5. Variables d’environnement sur Vercel

Dans Vercel > Settings > Environment Variables, ajouter les clés suivantes :

| Nom                     | Environnements                  |
|--------------------------|--------------------------------|
| `VITE_SUPABASE_URL`      | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `VITE_OPENROUTER_API_KEY` | Production, Preview, Development |

---

## 6. Structure de la table `menu`

| Champ               | Type      | Description                                  |
|--------------------|-----------|----------------------------------------------|
| `id`               | BIGSERIAL | Clé primaire auto-incrémentée                |
| `nom`              | TEXT      | Nom du plat (FR)                             |
| `description_fr`   | TEXT      | Description du plat (FR)                     |
| `prix`             | TEXT      | Prix affiché (ex. : `18€`)                   |
| `categorie`        | TEXT      | `entrees`, `plats` ou `desserts`            |
| `nom_en`, `nom_es`, `nom_jp`, `nom_zh` | TEXT | Traductions automatiques       |
| `description_en`, `description_es`, `description_jp`, `description_zh` | TEXT | Traductions automatiques |
| `created_at`        | TIMESTAMP | Date de création                            |
| `updated_at`        | TIMESTAMP | Date de dernière modification               |

---

## 7. Lien vers le site

Le site final est accessible ici :  
👉 [https://carte-chez-alphonse.fr](https://carte-chez-alphonse.fr)

---

## 8. Sécurité

- Authentification minimale via mot de passe administrateur
- Clé anonyme Supabase protégée via RLS (Row Level Security)
- Aucune donnée sensible n’est exposée dans le frontend
- API Key OpenRouter stockée dans les variables d’environnement
- Toutes les communications s’effectuent via HTTPS (Vercel)

---

## 9. Avantages

- Plus besoin d’imprimer l’ardoise ou de corriger manuellement la carte
- Réduction des erreurs de service liées aux ruptures de stock
- Meilleure transparence pour les clients
- Adapté à une clientèle touristique grâce aux traductions automatiques
- Déploiement simple, responsive, scalable

---

## 10. Auteur

Projet conçu et réalisé par **Kevin P.**, serveur chez **Chez Alphonse** et étudiant en école d’ingénieur, dans une optique d’automatisation utile, rapide à déployer, et maintenable par une équipe non technique.


