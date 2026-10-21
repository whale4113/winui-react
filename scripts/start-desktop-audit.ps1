$galleryWorkspace = Split-Path -Parent $PSScriptRoot
$galleryExecutable = Join-Path $galleryWorkspace 'src-tauri/target/release/winui-react-gallery.exe'
if (-not (Test-Path -LiteralPath $galleryExecutable)) {
    throw 'Build the desktop app with npm run desktop:build first.'
}
# Keep the test WebView2 profile inside the writable workspace. This avoids
# inherited restricted test-process permissions on the normal LocalAppData path.
$env:WEBVIEW2_USER_DATA_FOLDER = Join-Path $galleryWorkspace '.webview2-audit'
$galleryEvidence = Join-Path $galleryWorkspace 'visual-evidence'
New-Item -ItemType Directory -Force -Path $galleryEvidence | Out-Null
Start-Process -FilePath $galleryExecutable -WindowStyle Hidden -RedirectStandardError (Join-Path $galleryEvidence 'tauri-startup.log') -PassThru
