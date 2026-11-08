/// Données de test d'origine (migration 2). NE PAS MODIFIER : la migration est déjà
/// appliquée sur les bases existantes et sqlx refuse une migration dont le contenu a changé.
/// Ces données sont remplacées par `naturopathy_seed_data` (migration 4).
pub fn seed_data() -> &'static str {
    r#"
        -- Treatment types
        INSERT OR IGNORE INTO Treatment_type (id_type, name)
        VALUES
            (1, 'Antibiotic'),
            (2, 'Antiviral'),
            (3, 'Anti-inflammatory');

        -- Diseases
        INSERT OR IGNORE INTO Disease (id_disease, name)
        VALUES
            (1, 'Flu'),
            (2, 'Infection'),
            (3, 'Headache');

        -- Treatments
        INSERT OR IGNORE INTO Treatment
        (id_treatment, name, primary_property, secondary_property, contraindication, id_type, description)
        VALUES
            (1, 'Amoxicillin', 'Kills bacteria', NULL, 'Allergy to penicillin', 1, 'Used for bacterial infections'),
            (2, 'Ibuprofen', 'Reduces inflammation', 'Pain relief', 'Stomach ulcer', 3, 'Pain relief treatment');

        -- Cure relationships
        INSERT OR IGNORE INTO cure (id_disease, id_treatment, usage)
        VALUES
            (2, 1, '500mg twice daily'),
            (3, 2, '200mg as needed');

        -- Interactions
        INSERT OR IGNORE INTO interaction (id_treatment, id_treatment_1)
        VALUES
            (1, 2);
    "#
}

/// Jeu de données d'exemple en naturopathie (migration 4).
///
/// - Supprime les anciennes données de test en anglais (migration 2), seulement si elles
///   portent encore leur nom d'origine.
/// - Ajoute les nouvelles données SANS rien écraser : chaque élément n'est inséré que si
///   aucun élément du même nom n'existe ; les liens sont résolus par nom (pas d'id fixes,
///   pour ne jamais entrer en collision avec des données saisies par l'utilisateur).
/// - Les textes utilisent l'apostrophe typographique ’ (pas besoin d'échapper en SQL).
///
/// Ce sont des exemples illustratifs, à vérifier et adapter par la praticienne.
pub fn naturopathy_seed_data() -> &'static str {
    r#"
        -- 1. Suppression des anciennes données de test ------------------------------
        DELETE FROM interaction
         WHERE id_treatment   IN (SELECT id_treatment FROM Treatment WHERE name IN ('Amoxicillin', 'Ibuprofen'))
            OR id_treatment_1 IN (SELECT id_treatment FROM Treatment WHERE name IN ('Amoxicillin', 'Ibuprofen'));
        DELETE FROM cure
         WHERE id_treatment IN (SELECT id_treatment FROM Treatment WHERE name IN ('Amoxicillin', 'Ibuprofen'))
            OR id_disease   IN (SELECT id_disease FROM Disease WHERE name IN ('Flu', 'Infection', 'Headache'));
        DELETE FROM Treatment WHERE name IN ('Amoxicillin', 'Ibuprofen');
        DELETE FROM Disease WHERE name IN ('Flu', 'Infection', 'Headache');
        DELETE FROM Treatment_type
         WHERE name IN ('Antibiotic', 'Antiviral', 'Anti-inflammatory')
           AND id_type NOT IN (SELECT id_type FROM Treatment);

        -- 2. Solutions (types de traitement) ------------------------------------------
        INSERT INTO Treatment_type (name)
        SELECT v.column1
          FROM (VALUES
            ('Huile essentielle'),
            ('Plante (tisane)'),
            ('Gemmothérapie'),
            ('Fleur de Bach'),
            ('Complément alimentaire'),
            ('Hydrolat'),
            ('Argile')
          ) v
         WHERE NOT EXISTS (SELECT 1 FROM Treatment_type t WHERE t.name = v.column1);

        -- 3. Traitements ---------------------------------------------------------------
        -- colonnes : nom, propriété principale, propriété secondaire, contre-indications, solution, description
        INSERT INTO Treatment (name, primary_property, secondary_property, contraindication, id_type, description)
        SELECT v.column1, v.column2, v.column3, v.column4, ty.id_type, v.column6
          FROM (VALUES
            ('Tea tree',
             'Anti-infectieuse à large spectre (antibactérienne, antifongique)',
             'Immunostimulante',
             'Femme enceinte (3 premiers mois), enfant de moins de 3 ans. Peut irriter les peaux sensibles : toujours faire un test au pli du coude.',
             'Huile essentielle',
             'Melaleuca alternifolia. Huile essentielle polyvalente, très utilisée pour les problèmes de peau et les petites infections.'),
            ('Lavande vraie',
             'Calmante, relaxante, favorise l’endormissement',
             'Cicatrisante, apaisante cutanée',
             'Femme enceinte (3 premiers mois). Allergie connue à la lavande.',
             'Huile essentielle',
             'Lavandula angustifolia. Huile essentielle très douce, souvent la première conseillée pour le stress et le sommeil.'),
            ('Menthe poivrée',
             'Antalgique par effet froid (maux de tête)',
             'Digestive, anti-nauséeuse',
             'Femme enceinte ou allaitante, enfant de moins de 6 ans, épilepsie, hypertension. Ne jamais appliquer sur une grande surface du corps ni près des yeux.',
             'Huile essentielle',
             'Mentha x piperita. Huile essentielle puissante, à utiliser en petite quantité.'),
            ('Ravintsara',
             'Antivirale, immunostimulante',
             'Expectorante',
             'Femme enceinte (3 premiers mois), enfant de moins de 3 ans. Prudence en cas d’asthme.',
             'Huile essentielle',
             'Cinnamomum camphora (chémotype cinéole). Huile essentielle de référence de l’hiver.'),
            ('Eucalyptus radié',
             'Décongestionnante respiratoire, expectorante',
             'Antivirale',
             'Enfant de moins de 3 ans, asthme, femme enceinte (3 premiers mois).',
             'Huile essentielle',
             'Eucalyptus radiata. Plus douce que l’eucalyptus globuleux, adaptée aux voies respiratoires.'),
            ('Camomille matricaire',
             'Digestive, apaisante',
             'Anti-inflammatoire',
             'Allergie aux plantes de la famille des astéracées (marguerite, arnica…).',
             'Plante (tisane)',
             'Matricaria chamomilla. Fleurs en infusion.'),
            ('Mélisse',
             'Calmante, aide au sommeil',
             'Antispasmodique digestive',
             'Prudence en cas d’hypothyroïdie.',
             'Plante (tisane)',
             'Melissa officinalis. Feuilles en infusion, au goût citronné.'),
            ('Thym',
             'Antiseptique des voies respiratoires',
             'Tonique général',
             'Femme enceinte à forte dose.',
             'Plante (tisane)',
             'Thymus vulgaris. Feuilles et sommités fleuries en infusion.'),
            ('Gingembre',
             'Anti-nauséeux',
             'Digestif, anti-inflammatoire',
             'Traitement anticoagulant, calculs biliaires.',
             'Plante (tisane)',
             'Zingiber officinale. Racine fraîche ou séchée, en infusion ou en décoction.'),
            ('Valériane',
             'Sédative, favorise le sommeil',
             'Anxiolytique légère',
             'Femme enceinte ou allaitante, enfant de moins de 12 ans. Ne pas associer à des somnifères ni à l’alcool. Peut provoquer une somnolence : prudence pour la conduite.',
             'Plante (tisane)',
             'Valeriana officinalis. Racine, plutôt en gélules ou en teinture qu’en tisane (goût fort).'),
            ('Ginkgo',
             'Favorise la circulation sanguine',
             'Soutien de la mémoire et de la concentration',
             'Traitement anticoagulant ou antiagrégant, avant une opération chirurgicale, femme enceinte.',
             'Plante (tisane)',
             'Ginkgo biloba. Feuilles, le plus souvent sous forme d’extrait standardisé.'),
            ('Bourgeon de cassis',
             'Anti-inflammatoire et antiallergique naturel',
             'Tonique, soutien en cas de fatigue',
             'Prudence en cas d’hypertension.',
             'Gemmothérapie',
             'Ribes nigrum. Macérat de bourgeons frais, surnommé « la cortisone végétale ».'),
            ('Remède d’urgence',
             'Apaise le stress aigu et les chocs émotionnels',
             NULL,
             'Contient de l’alcool : préférer la version sans alcool pour la femme enceinte, l’enfant ou en cas de sevrage alcoolique.',
             'Fleur de Bach',
             'Mélange de cinq fleurs de Bach (Rescue).'),
            ('Magnésium',
             'Réduit la fatigue et le stress',
             'Détente musculaire (crampes)',
             'Insuffisance rénale. Espacer de 2 heures avec certains médicaments (antibiotiques, hormones thyroïdiennes).',
             'Complément alimentaire',
             'Préférer les formes bien tolérées (bisglycinate, citrate) au magnésium marin, plus laxatif.'),
            ('Probiotiques',
             'Rééquilibrent la flore intestinale',
             'Soutien de l’immunité',
             'Immunodépression sévère.',
             'Complément alimentaire',
             'Souches de bactéries bénéfiques (lactobacilles, bifidobactéries).'),
            ('Hydrolat de lavande',
             'Apaisant et purifiant pour la peau',
             'Calmant',
             NULL,
             'Hydrolat',
             'Eau florale issue de la distillation de la lavande, très douce, utilisable chez l’enfant.'),
            ('Argile verte',
             'Absorbante, purifiante',
             'Cicatrisante',
             'Par voie interne : espacer de 2 heures avec les médicaments, déconseillée en cas de constipation.',
             'Argile',
             'Argile verte illite ou montmorillonite, en masque ou en cataplasme.')
          ) v
          JOIN Treatment_type ty ON ty.name = v.column5
         WHERE NOT EXISTS (SELECT 1 FROM Treatment t WHERE t.name = v.column1);

        -- 4. Pathologies ---------------------------------------------------------------
        INSERT INTO Disease (name, description)
        SELECT v.column1, v.column2
          FROM (VALUES
            ('Acné', 'Inflammation des follicules pilo-sébacés : boutons, points noirs, peau grasse. Fréquente à l’adolescence mais aussi chez l’adulte (hormones, alimentation, stress).'),
            ('Rhume', 'Infection virale bénigne du nez et de la gorge : nez qui coule ou bouché, éternuements, léger mal de gorge.'),
            ('État grippal', 'Fièvre, courbatures, fatigue intense et maux de tête. Agir dès les premiers symptômes. Consulter si la fièvre dure plus de 3 jours.'),
            ('Troubles du sommeil', 'Difficultés d’endormissement, réveils nocturnes ou sommeil peu réparateur.'),
            ('Stress et anxiété', 'Tension nerveuse, irritabilité, nervosité, parfois accompagnées de troubles digestifs ou du sommeil.'),
            ('Ballonnements', 'Gonflement du ventre et gaz après les repas, souvent liés à une digestion lente ou à un déséquilibre de la flore intestinale.'),
            ('Nausées', 'Envie de vomir : mal des transports, digestion difficile, début de grossesse (demander un avis avant tout traitement).'),
            ('Maux de tête', 'Céphalées de tension : douleur en bandeau, souvent liée au stress, à la fatigue ou à une mauvaise posture.'),
            ('Fatigue', 'Baisse d’énergie physique ou mentale, souvent liée au surmenage, au manque de sommeil ou aux changements de saison.'),
            ('Rhume des foins', 'Allergie saisonnière aux pollens : éternuements, nez qui coule, yeux qui piquent.'),
            ('Mycose cutanée', 'Infection de la peau par des champignons : rougeurs, démangeaisons, desquamation (pied d’athlète, plis…).'),
            ('Jambes lourdes', 'Sensation de pesanteur et de gonflement des jambes, aggravée par la chaleur et la station debout prolongée.'),
            ('Crampes musculaires', 'Contractions involontaires et douloureuses d’un muscle, souvent la nuit ou après un effort.')
          ) v
         WHERE NOT EXISTS (SELECT 1 FROM Disease d WHERE d.name = v.column1);

        -- 5. Traitements par pathologie, avec le mode d’utilisation ----------------------
        INSERT OR IGNORE INTO cure (id_disease, id_treatment, usage)
        SELECT d.id_disease, t.id_treatment, v.column3
          FROM (VALUES
            ('Acné', 'Tea tree', '1 goutte diluée dans 1 goutte d’huile végétale (jojoba), directement sur le bouton matin et soir, pendant 5 à 7 jours.'),
            ('Acné', 'Argile verte', 'Masque 1 à 2 fois par semaine : appliquer en couche épaisse 10 minutes, rincer avant que l’argile ne sèche complètement.'),
            ('Acné', 'Hydrolat de lavande', 'En lotion tonique matin et soir sur un coton, après le nettoyage du visage.'),

            ('Rhume', 'Eucalyptus radié', 'Inhalation : 3 gouttes dans un bol d’eau chaude, respirer 5 à 10 minutes sous une serviette, 2 à 3 fois par jour.'),
            ('Rhume', 'Ravintsara', '2 gouttes diluées dans 6 gouttes d’huile végétale en massage sur le thorax et le haut du dos, 3 fois par jour pendant 5 jours.'),
            ('Rhume', 'Thym', 'Infusion : 1 cuillère à café pour une tasse d’eau frémissante, 10 minutes. 2 à 3 tasses par jour, avec du miel.'),

            ('État grippal', 'Ravintsara', 'Dès les premiers symptômes : 2 gouttes diluées en massage sur la face interne des poignets et le thorax, 4 fois par jour pendant 3 à 5 jours.'),
            ('État grippal', 'Thym', '3 tasses d’infusion par jour pendant toute la durée des symptômes.'),

            ('Troubles du sommeil', 'Valériane', 'Selon la posologie du fabricant, 30 minutes à 1 heure avant le coucher, en cure de 3 semaines maximum.'),
            ('Troubles du sommeil', 'Mélisse', '1 tasse d’infusion après le dîner.'),
            ('Troubles du sommeil', 'Lavande vraie', '2 gouttes sur l’oreiller, ou 10 minutes de diffusion dans la chambre avant le coucher.'),

            ('Stress et anxiété', 'Remède d’urgence', '4 gouttes directement sur la langue, ou dans un verre d’eau à siroter. À renouveler si besoin.'),
            ('Stress et anxiété', 'Magnésium', 'Cure de 1 mois selon la posologie du fabricant, à renouveler aux changements de saison.'),
            ('Stress et anxiété', 'Lavande vraie', '1 goutte sur la face interne des poignets, frotter puis respirer profondément.'),
            ('Stress et anxiété', 'Mélisse', '2 à 3 tasses d’infusion réparties dans la journée.'),

            ('Ballonnements', 'Camomille matricaire', '1 tasse d’infusion après chaque repas.'),
            ('Ballonnements', 'Menthe poivrée', '1 goutte diluée dans 4 gouttes d’huile végétale, en massage du ventre dans le sens des aiguilles d’une montre.'),
            ('Ballonnements', 'Probiotiques', 'Cure de 1 mois, le matin à jeun.'),

            ('Nausées', 'Gingembre', 'Infusion de 2 à 3 fines tranches de racine fraîche pendant 10 minutes, à boire par petites gorgées.'),
            ('Nausées', 'Menthe poivrée', 'Respirer directement le flacon ouvert, quelques inspirations profondes.'),

            ('Maux de tête', 'Menthe poivrée', '1 goutte en massage sur les tempes et la nuque, en évitant soigneusement les yeux. Se laver les mains après.'),
            ('Maux de tête', 'Lavande vraie', '2 gouttes diluées en massage sur les tempes et la nuque, en complément de la menthe poivrée si besoin.'),

            ('Fatigue', 'Magnésium', 'Cure de 1 mois selon la posologie du fabricant.'),
            ('Fatigue', 'Bourgeon de cassis', '5 à 15 gouttes le matin dans un peu d’eau, en cure de 3 semaines.'),

            ('Rhume des foins', 'Bourgeon de cassis', '5 à 15 gouttes par jour dans un peu d’eau, à commencer 1 mois avant la saison des pollens.'),

            ('Mycose cutanée', 'Tea tree', '2 gouttes diluées dans 8 gouttes d’huile végétale, 2 à 3 fois par jour sur la zone, pendant 2 à 3 semaines. Bien sécher la peau avant.'),

            ('Jambes lourdes', 'Ginkgo', 'Selon la posologie du fabricant, en cure de 1 à 3 mois.'),
            ('Jambes lourdes', 'Menthe poivrée', '1 goutte diluée dans 9 gouttes d’huile végétale, en massage des chevilles vers les cuisses (effet froid).'),

            ('Crampes musculaires', 'Magnésium', 'Cure de 1 mois, prise le soir de préférence.')
          ) v
          JOIN Disease d ON d.name = v.column1
          JOIN Treatment t ON t.name = v.column2;

        -- 6. Interactions ----------------------------------------------------------------
        -- Gingembre et ginkgo ont tous deux un effet fluidifiant sanguin : risque de saignement cumulé.
        INSERT OR IGNORE INTO interaction (id_treatment, id_treatment_1)
        SELECT a.id_treatment, b.id_treatment
          FROM (VALUES
            ('Gingembre', 'Ginkgo')
          ) v
          JOIN Treatment a ON a.name = v.column1
          JOIN Treatment b ON b.name = v.column2
         WHERE NOT EXISTS (
           SELECT 1 FROM interaction i
            WHERE (i.id_treatment = a.id_treatment AND i.id_treatment_1 = b.id_treatment)
               OR (i.id_treatment = b.id_treatment AND i.id_treatment_1 = a.id_treatment)
         );
    "#
}
