use crate::seeds;
use tauri_plugin_sql::{Migration, MigrationKind};

pub fn all() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "init schema",
            sql: r#"
                PRAGMA foreign_keys = ON;

                CREATE TABLE IF NOT EXISTS Treatment_type (
                    id_type INTEGER PRIMARY KEY,
                    name TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS Treatment (
                    id_treatment INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    primary_property TEXT,
                    secondary_property TEXT,
                    contraindication TEXT,
                    id_type INTEGER NOT NULL,
                    description TEXT,
                    FOREIGN KEY(id_type) REFERENCES Treatment_type(id_type)
                );

                CREATE TABLE IF NOT EXISTS Disease (
                    id_disease INTEGER PRIMARY KEY,
                    name TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS cure (
                    id_disease INTEGER NOT NULL,
                    id_treatment INTEGER NOT NULL,
                    usage TEXT,
                    PRIMARY KEY (id_disease, id_treatment),
                    FOREIGN KEY(id_disease) REFERENCES Disease(id_disease),
                    FOREIGN KEY(id_treatment) REFERENCES Treatment(id_treatment)
                );

                CREATE TABLE IF NOT EXISTS interaction (
                    id_treatment INTEGER NOT NULL,
                    id_treatment_1 INTEGER NOT NULL,
                    PRIMARY KEY (id_treatment, id_treatment_1),
                    FOREIGN KEY(id_treatment) REFERENCES Treatment(id_treatment),
                    FOREIGN KEY(id_treatment_1) REFERENCES Treatment(id_treatment)
                );
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "seed initial data",
            sql: seeds::seed_data(),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "add disease description",
            sql: "ALTER TABLE Disease ADD COLUMN description TEXT;",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "replace test data with naturopathy examples",
            sql: seeds::naturopathy_seed_data(),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "add treatment type icon",
            // Clés d'icônes définies dans src/components/solutionIcons.tsx.
            // Les solutions d'exemple reçoivent une icône seulement si elles n'en ont pas.
            sql: r#"
                ALTER TABLE Treatment_type ADD COLUMN icon TEXT;
                UPDATE Treatment_type SET icon = CASE name
                    WHEN 'Huile essentielle'      THEN 'essential-oil'
                    WHEN 'Plante (tisane)'        THEN 'herbal-tea'
                    WHEN 'Gemmothérapie'          THEN 'bud'
                    WHEN 'Fleur de Bach'          THEN 'flower'
                    WHEN 'Complément alimentaire' THEN 'capsule'
                    WHEN 'Hydrolat'               THEN 'spray'
                    WHEN 'Argile'                 THEN 'clay'
                END
                WHERE icon IS NULL;
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "add treatment type color and new solutions",
            // Clés de couleurs définies dans src/components/solutionColors.ts (NULL → vert).
            // Les solutions d'exemple reçoivent une couleur seulement si elles n'en ont pas ;
            // les nouvelles solutions ne sont ajoutées que si aucune ne porte déjà ce nom.
            sql: r#"
                ALTER TABLE Treatment_type ADD COLUMN color TEXT;
                UPDATE Treatment_type SET color = CASE name
                    WHEN 'Huile essentielle'      THEN 'violet'
                    WHEN 'Plante (tisane)'        THEN 'green'
                    WHEN 'Gemmothérapie'          THEN 'teal'
                    WHEN 'Fleur de Bach'          THEN 'pink'
                    WHEN 'Complément alimentaire' THEN 'indigo'
                    WHEN 'Hydrolat'               THEN 'blue'
                    WHEN 'Argile'                 THEN 'brown'
                END
                WHERE color IS NULL;
                INSERT INTO Treatment_type (name, icon, color)
                SELECT v.column1, v.column2, v.column3
                  FROM (VALUES
                    ('Apithérapie',       'bee',      'yellow'),
                    ('Exercice physique', 'dumbbell', 'orange'),
                    ('Alimentation',      'apple',    'red')
                  ) v
                 WHERE NOT EXISTS (
                    SELECT 1 FROM Treatment_type t WHERE t.name = v.column1 COLLATE NOCASE
                 );
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "new icons for exercise and food, more solutions",
            // Nouvelles icônes seulement si l'utilisatrice n'a pas changé celles de la migration 6.
            sql: r#"
                UPDATE Treatment_type SET icon = 'runner'
                 WHERE name = 'Exercice physique' AND icon = 'dumbbell';
                UPDATE Treatment_type SET icon = 'plate'
                 WHERE name = 'Alimentation' AND icon = 'apple';
                INSERT INTO Treatment_type (name, icon, color)
                SELECT v.column1, v.column2, v.column3
                  FROM (VALUES
                    ('Hydrothérapie',             'waves',     'cyan'),
                    ('Respiration et relaxation', 'wind',      'lime'),
                    ('Réflexologie',              'footprint', 'fuchsia')
                  ) v
                 WHERE NOT EXISTS (
                    SELECT 1 FROM Treatment_type t WHERE t.name = v.column1 COLLATE NOCASE
                 );
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "more solutions: sleep, sunlight, fasting, trace elements",
            sql: r#"
                INSERT INTO Treatment_type (name, icon, color)
                SELECT v.column1, v.column2, v.column3
                  FROM (VALUES
                    ('Sommeil',          'moon',      'indigo'),
                    ('Héliothérapie',    'sun',       'yellow'),
                    ('Jeûne et détox',   'hourglass', 'gray'),
                    ('Oligothérapie',    'crystal',   'blue')
                  ) v
                 WHERE NOT EXISTS (
                    SELECT 1 FROM Treatment_type t WHERE t.name = v.column1 COLLATE NOCASE
                 );
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 9,
            description: "retire teal, indigo and fuchsia colors",
            // Palette réduite à 11 couleurs (une ligne dans le sélecteur). Les solutions d'exemple
            // reçoivent une couleur choisie (si elle n'a pas été changée), les autres la plus proche.
            sql: r#"
                UPDATE Treatment_type SET color = 'lime'
                 WHERE name = 'Gemmothérapie' AND color = 'teal';
                UPDATE Treatment_type SET color = 'gray'
                 WHERE name = 'Complément alimentaire' AND color = 'indigo';
                UPDATE Treatment_type SET color = 'violet'
                 WHERE name = 'Sommeil' AND color = 'indigo';
                UPDATE Treatment_type SET color = 'pink'
                 WHERE name = 'Réflexologie' AND color = 'fuchsia';
                UPDATE Treatment_type SET color = 'cyan' WHERE color = 'teal';
                UPDATE Treatment_type SET color = 'blue' WHERE color = 'indigo';
                UPDATE Treatment_type SET color = 'pink' WHERE color = 'fuchsia';
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 10,
            description: "more solutions: micronutrition, gemmology, revitalisation, TCM",
            sql: r#"
                INSERT INTO Treatment_type (name, icon, color)
                SELECT v.column1, v.column2, v.column3
                  FROM (VALUES
                    ('Micronutrition',                  'molecule', 'cyan'),
                    ('Gemmologie',                      'quartz',   'violet'),
                    ('Techniques de revitalisation',    'battery',  'orange'),
                    ('Médecine traditionnelle chinoise', 'yin-yang', 'red')
                  ) v
                 WHERE NOT EXISTS (
                    SELECT 1 FROM Treatment_type t WHERE t.name = v.column1 COLLATE NOCASE
                 );
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 11,
            description: "disease approaches",
            // Approches (systèmes du corps) d'une pathologie. Liste fixe définie dans le code
            // (src/components/approaches.tsx) : on ne stocke que la clé.
            sql: r#"
                CREATE TABLE IF NOT EXISTS disease_approach (
                    id_disease INTEGER NOT NULL,
                    approach TEXT NOT NULL,
                    PRIMARY KEY (id_disease, approach),
                    FOREIGN KEY(id_disease) REFERENCES Disease(id_disease)
                );
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 12,
            description: "single approach per disease",
            // Finalement une seule approche par pathologie : colonne Disease.approach (clé ou NULL)
            // à la place de la table de liaison de la migration 11 (on garde la première si plusieurs).
            sql: r#"
                ALTER TABLE Disease ADD COLUMN approach TEXT;
                UPDATE Disease SET approach = (
                    SELECT MIN(a.approach) FROM disease_approach a WHERE a.id_disease = Disease.id_disease
                );
                DROP TABLE disease_approach;
            "#,
            kind: MigrationKind::Up,
        },
    ]
}
