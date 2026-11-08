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
    ]
}
