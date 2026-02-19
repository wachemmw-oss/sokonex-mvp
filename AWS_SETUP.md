# Guide de Configuration AWS S3 pour SOKONEX

Ce guide détaille chaque étape pour configurer AWS S3 afin que l'upload et l'affichage des images fonctionnent correctement.

## Étape 1 : Créer un compte AWS (si ce n'est pas fait)
1. Allez sur [aws.amazon.com] B).
2. Cliquez sur **Create an AWS Account** / **Créez un compte AWS**.
3. Suivez les étapes (email, mot de passe, adresse).
4. **Carte bancaire** : AWS demande une carte pour vérifier l'identité. Vous ne serez débité que si vous dépassez l'offre gratuite (S3 offre 5GB de stockage gratuit la première année).
5. Validez votre compte par SMS.
6. Choisissez le plan **Basic Support (Free)**.

---

## Étape 2 : Créer un Bucket S3
Le "Bucket" est le dossier dans le cloud où seront stockées les images.

1. Connectez-vous à la **Console AWS**.
2. Dans la barre de recherche en haut, tapez **S3** et cliquez sur le service.
3. Cliquez sur le bouton orange **Create bucket** (Créer un compartiment).
4. **Bucket name** : Donnez un nom unique (ex: `sokonex-images-dev-[votre-nom]`). Notez ce nom.
5. **AWS Region** : Choisissez une région proche (ex: `us-east-1` N. Virginia ou `eu-west-3` Paris). Notez cette région.
6. **Object Ownership** : Laissez par défaut (`ACLs disabled`).
7. **Block Public Access settings for this bucket** :
   - **Décochez** la case "Block *all* public access".
   - Cochez la case de confirmation "I acknowledge that the current settings might result in this bucket and the objects within becoming public".
   - *Pourquoi ?* Pour que les images soient visibles par tout le monde sur le site marketplace sans complication.
8. Laissez le reste par défaut et cliquez sur **Create bucket** tout en bas.

---

## Étape 3 : Configurer les Permissions du Bucket (Lecture Publique - Optionnel pour MVP)
Pour simplifier l'accès, autorisez la lecture publique.

1. Cliquez sur le nom de votre bucket.
2. Allez dans l'onglet **Permissions**.
3. Section **Bucket policy** -> **Edit**.
4. Collez le code ci-dessous dans l'éditeur.
   **ATTENTION :** Vous devez remplacer `NOM_DU_BUCKET` par le nom exact que vous avez donné à votre bucket à l'étape 2 (ex: `sokonex-images-mon-nom`).

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::NOM_DU_BUCKET/*"
        }
    ]
}
```
**Explication :**
- `"Principal": "*"` : Tout le monde (n'importe quel visiteur sur internet).
- `"Action": "s3:GetObject"` : A le droit de TÉLÉCHARGER/VOIR les fichiers.
- `"Resource": "arn:aws:s3:::NOM_DU_BUCKET/*"` : Dans ce bucket et tous ses dossiers (`/*`).

Sans cela, vos images s'uploaderont mais personne ne pourra les voir (erreur 403 Forbidden).
5. **Save changes**.

---

## Étape 4 : Configurer CORS (CRITIQUE pour l'upload Frontend)
Le frontend (React) va uploader directement vers S3. Il faut l'autoriser explicitement.

1. Toujours dans **Permissions** du bucket.
2. Tout en bas -> **Cross-origin resource sharing (CORS)** -> **Edit**.
3. Collez ce JSON :

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```
*(Note : Pour le dev local `localhost`, `"*"` est le plus simple. En prod, mettez l'URL de votre site).*
4. **Save changes**.

---

## Étape 5 : Créer un Utilisateur IAM (Clés d'accès backend)
Le backend a besoin de clés pour générer des liens d'upload sécurisés.

1. Cherchez **IAM** dans la barre de recherche AWS.
2. Menu gauche -> **Users** -> **Create user**.
3. **User name** : `sokonex-backend`. Suivant.
4. **Permissions** :
   - Cliquez sur le carré **Attach policies directly**.
   - Cherchez `S3Full`.
   - Cochez **AmazonS3FullAccess**.
   - Suivant -> **Create user**.

5. Cliquez sur l'utilisateur créé (`sokonex-backend`).
6. Onglet **Security credentials**.
7. Section **Access keys** -> **Create access key**.
8. Choisissez **Application running outside AWS**.
9.  Cliquez sur **Next**.
10. **Description tag value** : C'est juste un nom pour vous souvenir à quoi ça sert.
    - Écrivez : `Backend SOKONEX`
    - Cliquez sur **Create access key**.
10. **TRES IMPORTANT** : Copiez la **Access key** et la **Secret access key**.
    - C'est le SEUL moment où vous pouvez voir la clé secrète.

---

## Étape 6 : Remplir `backend/.env`
Ouvrez le fichier `.env` dans le dossier backend et mettez vos valeurs :

```env
AWS_ACCESS_KEY_ID=AKIA... (votre clé d'accès)
AWS_SECRET_ACCESS_KEY=wJalr... (votre clé secrète)
AWS_REGION=us-east-1 (votre région, ex: us-east-1)
AWS_BUCKET_NAME=nom-de-votre-bucket
```

Une fois fait, redémarrez le serveur backend (`Ctrl+C` puis `npm run dev`).
