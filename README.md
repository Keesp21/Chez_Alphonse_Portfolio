# Projet Chez Alphonse

Ce projet est une interface numérique conçue pour le restaurant **Chez Alphonse**, permettant de mettre à jour la carte du jour en temps réel via une interface d'administration. Le site est optimisé pour un affichage multi-langue et une synchronisation instantanée entre tous les appareils connectés.

---

## 1. Contexte

Travaillant comme serveur au sein du restaurant Chez Alphonse, j'ai identifié une difficulté récurrente : le besoin de modifier plusieurs fois l'ardoise en plein service, en raison de la forte rotation des produits frais. Ce projet a été conçu comme une solution à ce problème terrain.

---

## 2. Architecture technique

- **Frontend** : React + Vite
- **Base de données** : Supabase
- **Déploiement** : Vercel
- **Traduction automatique** : via API DeepSeek intégrée à OpenRouter
- **Realtime** : Supabase Realtime pour la synchronisation de la carte

---

## 3. Fonctionnalités clés

- Interface admin sécurisée (mot de passe)
- Ajout / modification / suppression de plats
- Traductions multilingues : français, anglais, espagnol, japonais, chinois
- Synchronisation en temps réel sur tous les clients
- Stockage et récupération depuis Supabase

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

Créer un fichier `.env.local` :

```env
VITE_SUPABASE_URL=https://<votre-projet>.supabase.co
VITE_SUPABASE_ANON_KEY=<votre-clé-anonyme>
```

---

## 5. Variables d'environnement pour Vercel

Rendez-vous dans le tableau de bord Vercel > Settings > Environment Variables, et ajoutez :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Définir pour les environnements : Production, Preview, Development.

---

## 6. Lien vers le site

Le site est accessible à cette adresse : **https://carte-chez-alphonse.vercel.app**

---

## 7. Sécurité

- Accès admin via mot de passe unique
- RLS activé sur Supabase
- Aucune clé sensible exposée côté client
- HTTPS natif avec Vercel

---

## 8. Auteur

Projet réalisé par Kevin P. (Serveur chez Chez Alphonse), en parallèle de mes études en école d'ingénieur.

