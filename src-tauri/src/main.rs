#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct AccentColors {
    theme: String,
    background: String,
    foreground: String,
    accent: String,
    light: String,
    dark: String,
}

#[tauri::command]
fn system_accent() -> Result<AccentColors, String> {
    #[cfg(windows)]
    {
        use windows::UI::ViewManagement::{UIColorType, UISettings};
        let settings = UISettings::new().map_err(|e| e.to_string())?;
        let color = |kind| -> Result<String, String> {
            let c = settings.GetColorValue(kind).map_err(|e| e.to_string())?;
            Ok(format!("#{:02x}{:02x}{:02x}", c.R, c.G, c.B))
        };
        let foreground = settings
            .GetColorValue(UIColorType::Foreground)
            .map_err(|e| e.to_string())?;
        // Microsoft's UISettings foreground brightness test detects the app theme,
        // including Windows color-mode changes, without relying on cached CSS.
        let dark =
            5 * foreground.G as u32 + 2 * foreground.R as u32 + foreground.B as u32 > 8 * 128;
        Ok(AccentColors {
            theme: if dark { "dark" } else { "light" }.into(),
            background: color(UIColorType::Background)?,
            foreground: color(UIColorType::Foreground)?,
            accent: color(UIColorType::Accent)?,
            light: color(UIColorType::AccentLight2)?,
            dark: color(UIColorType::AccentDark1)?,
        })
    }
    #[cfg(not(windows))]
    Err("System accent is only available on Windows".into())
}

#[tauri::command]
fn set_mica(window: tauri::WebviewWindow, dark: bool) -> Result<u32, String> {
    #[cfg(windows)]
    {
        use windows::Win32::{Graphics::Dwm::DwmExtendFrameIntoClientArea, UI::Controls::MARGINS};
        let hwnd = window.hwnd().map_err(|e| e.to_string())?;
        // A frameless window needs the DWM frame over its entire client area.
        // The CSS and WebView must both allow that native surface to show.
        unsafe {
            DwmExtendFrameIntoClientArea(
                hwnd,
                &MARGINS {
                    cxLeftWidth: -1,
                    cxRightWidth: -1,
                    cyTopHeight: -1,
                    cyBottomHeight: -1,
                },
            )
        }
        .map_err(|e| e.to_string())?;
        window
            .set_background_color(Some(tauri::window::Color(0, 0, 0, 0)))
            .map_err(|e| e.to_string())?;
    }
    window_vibrancy::apply_mica(&window, Some(dark)).map_err(|e| e.to_string())?;
    #[cfg(windows)]
    {
        use windows::Win32::Graphics::Dwm::{DwmGetWindowAttribute, DWMWA_SYSTEMBACKDROP_TYPE};
        let mut backdrop = 0u32;
        let hwnd = window.hwnd().map_err(|e| e.to_string())?;
        // Read back DWM's state rather than treating a CSS class as proof.
        let result = unsafe {
            DwmGetWindowAttribute(
                hwnd,
                DWMWA_SYSTEMBACKDROP_TYPE,
                &mut backdrop as *mut _ as *mut _,
                std::mem::size_of::<u32>() as u32,
            )
        };
        // Windows 11 21H2 uses the crate's legacy Mica attribute instead.
        if result.is_err() {
            return Ok(0);
        }
        if backdrop != 2 {
            return Err(format!("DWM did not enable Mica: backdrop type {backdrop}"));
        }
        return Ok(backdrop);
    }
    #[cfg(not(windows))]
    Ok(0)
}

fn main() {
    // Development runs must not share a WebView2 profile with installed or
    // sandbox-launched builds: their directory ACLs/browser settings can differ.
    #[cfg(all(windows, debug_assertions))]
    {
        let profile = std::env::var_os("WEBVIEW2_USER_DATA_FOLDER")
            .map(std::path::PathBuf::from)
            .unwrap_or_else(|| {
                std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../.webview2-dev/main")
            });
        let profile = if profile.is_absolute() {
            profile
        } else {
            std::env::current_dir()
                .expect("Cannot resolve working directory")
                .join(profile)
        };
        std::fs::create_dir_all(&profile)
            .map_err(|error| {
                std::io::Error::new(
                    error.kind(),
                    format!(
                        "Cannot create development WebView2 profile {}: {error}",
                        profile.display()
                    ),
                )
            })
            .expect("Cannot prepare development WebView2 profile");
        // Set before Tauri starts any threads; retain Tauri's normal
        // configured-window startup and initialization sequence.
        std::env::set_var("WEBVIEW2_USER_DATA_FOLDER", profile);
    }
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![system_accent, set_mica])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                if let Ok(appearance) = system_accent() {
                    if let Err(error) = set_mica(window, appearance.theme == "dark") {
                        eprintln!("Mica initialization failed: {error}");
                    }
                }
            }
            if std::env::args().any(|arg| arg == "--visual-audit") {
                if let Some(window) = app.get_webview_window("main") {
                    window.eval("location.search = '?visual-audit'")?;
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Failed to run WinUI React Gallery");
}
