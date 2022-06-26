#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use window_shadows::set_shadow;

#[tauri::command]
async fn write_store(app: tauri::AppHandle, name: String, data: String) -> Result<(), String> {
  let app_dir = app.path_resolver().app_dir().expect("failed to get app dir");
  let data_dir = app_dir.join("data");
  let path = data_dir.join(name + ".json");

  if !std::path::Path::new(&data_dir).exists() {
    std::fs::create_dir_all(data_dir).expect("failed to create data dir");
  }

  std::fs::write(&path, data)
    .map_err(|e| e.to_string());

  Ok(())
}

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![write_store])
    .setup(|app| {
      let win = app.get_window("main").unwrap();
      set_shadow(&win, true).expect("Unsupported platform!");

      Ok(())
    })
    .run(context)
    .expect("error while running tauri application");
}
