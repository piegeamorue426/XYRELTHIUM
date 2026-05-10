# Xyrelthium

E-commerce moderne specialise dans les produits tech, gaming et lifestyle. Construit avec Next.js 14, Supabase et Stripe.

## Stack technique

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS avec theme sombre et accents neon violet/bleu
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Paiements**: Stripe Checkout
- **Deploiement**: Vercel

## Prerequisites

- Node.js 18+ et npm
- Un compte [Supabase](https://supabase.com)
- Un compte [Stripe](https://stripe.com) (mode test)

## Installation

1. **Cloner le repository**

```bash
git clone https://github.com/your-username/xyrelthium.git
cd xyrelthium
```

2. **Installer les dependances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env.local
```

Remplir les valeurs dans `.env.local` (voir sections ci-dessous).

## Configuration Supabase

1. Creer un nouveau projet sur [app.supabase.com](https://app.supabase.com)
2. Recuperer les cles API dans **Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL du projet
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: cle anonyme (publique)
   - `SUPABASE_SERVICE_ROLE_KEY`: cle service role (privee, ne jamais exposer cote client)

3. **Executer la migration de base de donnees**:
   - Aller dans **SQL Editor** dans le dashboard Supabase
   - Copier/coller le contenu de `supabase/migrations/001_initial_schema.sql`
   - Executer la requete

4. **Activer l'authentification**:
   - Aller dans **Authentication > Providers**
   - Activer Email/Password
   - (Optionnel) Activer Google, GitHub ou d'autres providers OAuth

5. **Creer un bucket Storage** (pour les images produits):
   - Aller dans **Storage**
   - Creer un bucket nomme `products` avec acces public

## Configuration Stripe

1. Aller sur [dashboard.stripe.com](https://dashboard.stripe.com) en mode **Test**
2. Recuperer les cles dans **Developers > API Keys**:
   - `STRIPE_SECRET_KEY`: cle secrete (sk_test_...)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: cle publique (pk_test_...)

3. **Configurer le webhook** (pour recevoir les confirmations de paiement):
   - Aller dans **Developers > Webhooks**
   - Ajouter un endpoint: `https://votre-domaine.com/api/webhooks/stripe`
   - Evenements a ecouter: `checkout.session.completed`
   - Copier le secret du webhook dans `STRIPE_WEBHOOK_SECRET`

   Pour le developpement local, utiliser le CLI Stripe:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## Developpement

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
src/
  app/              # Pages et routes (App Router)
    layout.tsx      # Layout racine
    page.tsx        # Page d'accueil
    shop/           # Catalogue produits
    product/[id]/   # Page produit individuel
    admin/          # Dashboard administrateur
    api/            # Routes API (webhooks, etc.)
  components/       # Composants reutilisables
  lib/              # Utilitaires et clients
    supabase/       # Clients Supabase (browser, server, admin)
    stripe.ts       # Instance Stripe
    utils.ts        # Fonctions utilitaires
  types/            # Types TypeScript
supabase/
  migrations/       # Fichiers SQL de migration
```

## Deploiement sur Vercel

1. Connecter le repository GitHub a [Vercel](https://vercel.com)
2. Configurer les variables d'environnement dans les settings du projet:
   - Toutes les variables de `.env.example`
   - Mettre `NEXT_PUBLIC_SITE_URL` a l'URL de production
3. Deployer

## Configuration administrateur

Pour definir un utilisateur comme administrateur:

1. L'utilisateur doit d'abord se creer un compte sur le site
2. Dans le dashboard Supabase, aller dans **Table Editor > profiles**
3. Trouver l'utilisateur par son email
4. Changer la valeur de `role` de `user` a `admin`

Alternativement, executer cette requete SQL:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'votre-email@example.com';
```

## Variables d'environnement

| Variable | Description | Ou la trouver |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Supabase > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cle publique Supabase | Supabase > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Cle service role Supabase | Supabase > Settings > API |
| `STRIPE_SECRET_KEY` | Cle secrete Stripe | Stripe > Developers > API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Cle publique Stripe | Stripe > Developers > API Keys |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe | Stripe > Developers > Webhooks |
| `NEXT_PUBLIC_SITE_URL` | URL du site | Votre domaine de production |

## Licence

Projet prive - Tous droits reserves.
