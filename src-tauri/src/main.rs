#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use window_shadows::set_shadow;

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .setup(|app| {
      let win = app.get_window("main").unwrap();
      set_shadow(&win, true).expect("Unsupported platform!");

      Ok(())
    })
    .run(context)
    .expect("error while running tauri application");
}
