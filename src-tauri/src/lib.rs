mod migrations;
mod seeds;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Écrit un fichier de sauvegarde à l'emplacement choisi par l'utilisateur
/// dans la boîte de dialogue « Enregistrer sous ».
#[tauri::command]
fn write_backup_file(path: String, contents: String) -> Result<(), String> {
    std::fs::write(&path, contents)
        .map_err(|e| format!("Impossible d'écrire le fichier « {path} » : {e}"))
}

/// Lit un fichier de sauvegarde choisi par l'utilisateur dans la boîte de dialogue « Ouvrir ».
#[tauri::command]
fn read_backup_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path)
        .map_err(|e| format!("Impossible de lire le fichier « {path} » : {e}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:app.db", migrations::all())
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            write_backup_file,
            read_backup_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
