# opengate
**Cahier des Charges : Application Mobile pour Domotique avec Contrôle Bluetooth**

---

### **1. Contexte et Objectifs**

#### **Story utilisateur**
En tant qu'utilisateur (étant en vélo ou avec une poussette), je souhaite pouvoir ouvrir le portail et la porte de garage de ma maison sans sortir mon téléphone de ma poche.

Pour cela :
- J'utilise un device Bluetooth (un bouton) qui, une fois pressé, envoie une commande à l'application mobile pour exécuter l'action correspondante (par exemple, ouvrir le portail).
- Ma maison est équipée de domotique et expose une API web permettant de réaliser ces opérations.

L'objectif de l'application est de permettre un contrôle simple et sécurisé des équipements domotiques via Bluetooth et API.

---

### **2. Fonctionnalités de l’application**

#### **2.1. Settings**

1. **Configuration des actions** :
   - Permettre la création d'actions associées à des opérations domotiques.
   - Une action est configurée via :
     - **URL** : L'endpoint de l'API pour exécuter l'action (ex. ouvrir le portail).
     - **Méthode HTTP** : GET, POST, etc.
     - **Headers** : Informations de type token d’authentification.
     - **Payload** : Les données éventuelles à envoyer avec la requête.
     - **Authentification** : Ajout de mécanismes de sécurité comme OAuth ou API key.

2. **Configuration Bluetooth** :
   - Scanner et afficher les devices Bluetooth disponibles.
   - Permettre de connecter un device Bluetooth à l’application.
   - Gérer les devices connectés (ex. attacher, révoquer, renommer).

#### **2.2. Home**

1. **Tableau de bord des actions** :
   - Affichage d'un panneau constitué de **tuiles** représentant chaque action configurée.
   - Chaque tuile doit :
     - Permettre d’exécuter l’action associée en un clic.
     - Afficher un feedback visuel (succès/erreur) suite à l’exécution.

2. **Statut Bluetooth** :
   - Afficher les devices Bluetooth connectés actuellement.

#### **2.3. Fonctionnalités générales**

1. **Sécurité** :
   - Prendre en compte la criticité des actions domotiques (portail/garage).
   - Intégration d’authentification forte (par exemple, via mot de passe ou biométrie pour accéder aux paramètres).
   - Chiffrement des communications Bluetooth et API.

2. **Logs** :
   - Chaque exécution d’action doit être logguée avec :
     - Date/heure de l’exécution.
     - Device Bluetooth à l’origine de la demande.
     - Résultat de l’action (succès/erreur).

3. **Exécution automatique via Bluetooth** :
   - Permettre le déclenchement des actions configurées à partir du bouton Bluetooth sans intervention manuelle sur l’application.

4. **Option de géolocalisation** :
   - Ajouter une contrainte de proximité (à activer/désactiver dans les paramètres).
   - Exemple : Autoriser l’exécution d’actions uniquement si le téléphone est à moins de 300 mètres du domicile.

---

### **3. Spécifications Techniques**

#### **3.1. Bluetooth**
- Utilisation de **Bluetooth Low Energy (BLE)** pour garantir une faible consommation d’énergie.
- Gestion des permissions pour l’accès Bluetooth sur Android.

#### **3.2. API**
- Compatible avec les méthodes REST (GET, POST, PUT, DELETE).
- Support d’authentification OAuth2 ou via API key.
- Gérer les éventuelles erreurs HTTP (échecs de connexion, codes 4XX/5XX).

#### **3.3. Localisation**
- Utilisation des services de localisation d’Android.
- Vérification en temps réel de la distance entre l’utilisateur et l'adresse préconfigurée.

#### **3.4. Interface Utilisateur**
- Design intuitif avec focus sur l’accessibilité (boutons et tuiles visibles et facilement manipulables).
- Feedback utilisateur immédiat (changement de couleur, messages d’état).
- Support du mode sombre (optionnel).

---

### **4. Livrables Attendus**

1. **Application Android** :
   - Compatible avec Android 10 et versions supérieures.
   - APK installable avec documentation d’installation.

2. **Documentation** :
   - Guide utilisateur (configuration des actions, connexion Bluetooth, logs).
   - Détails techniques (architecture, endpoints API utilisés, sécurité).
   - **Contrat d'interface Bluetooth** : Fournir des exemples concrets de payloads Bluetooth permettant de déclencher les actions (par ex., structure des messages envoyés/reçus).

---

### **5. Points d’attention**

1. **Sécurité** : Garantir une protection optimale des données sensibles.
2. **Fiabilité Bluetooth** : Gérer les problèmes de connexion ou de perte de signal.
3. **Expérience Utilisateur** : Assurer une interface fluide et réactive.
4. **Scalabilité** : Prévoir la possibilité d’ajouter de nouvelles actions ou intégrations (ex. caméras de surveillance, capteurs).

---

