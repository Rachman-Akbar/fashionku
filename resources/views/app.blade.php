<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Fashionku') }}</title>

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap" rel="stylesheet" />

    {{--
      Mode MANUAL (dua terminal terpisah, port tidak bentrok):
      - Default: load aset dari public/build (hasil `npm run build`) → cukup `php artisan serve`.
      - HMR: set VITE_USE_DEV_SERVER=true di .env + jalankan `npm run dev` (5173), lalu buka app via Laravel.
      Hindari `public/hot` agar artisan serve tidak memaksa ke Vite saat dev server mati.
    --}}
    @if (app()->environment('local') && filter_var(env('VITE_USE_DEV_SERVER', false), FILTER_VALIDATE_BOOLEAN) && file_exists(public_path('hot')))
        @viteReactRefresh
        @vite(['resources/react/src/main.jsx'])
    @elseif (file_exists(public_path('build/manifest.json')))
        @php($manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true))
        @php($entry = $manifest['resources/react/src/main.jsx'] ?? null)
        @if (!empty($entry['css']))
            @foreach ($entry['css'] as $css)
                <link rel="stylesheet" href="{{ asset('build/'.$css) }}">
            @endforeach
        @endif
        @if (!empty($entry['file']))
            <script type="module" src="{{ asset('build/'.$entry['file']) }}"></script>
        @endif
    @else
        <style>
            body{font-family:system-ui,Segoe UI,Arial,sans-serif;padding:24px;line-height:1.5}
            code{background:#f3f4f6;padding:2px 6px;border-radius:4px}
        </style>
        <div id="app-build-hint">
            <strong>Aset frontend belum tersedia.</strong>
            <p>Jalankan di folder <code>fashionku</code> (terminal terpisah): <code>npm run build</code>, lalu muat ulang halaman ini.</p>
            <p>Atau aktifkan HMR manual: set <code>VITE_USE_DEV_SERVER=true</code> di <code>.env</code>, jalankan <code>npm run dev</code>, lalu akses aplikasi lewat Laravel.</p>
        </div>
    @endif
</head>
<body>
    {{--
      Splash statis: tampil segera dari HTML, lalu diganti React saat mount.
      Tanpa ini, saat bundel masih diunduh/parse layar terlihat putih kosong
      sehingga panel terasa "nyandet".
    --}}
    <div id="root">
        <div id="boot-splash" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;background:#fff;font-family:system-ui,Segoe UI,Arial,sans-serif">
            <div style="width:36px;height:36px;border-radius:9999px;border:4px solid #e0e3e7;border-top-color:#10B981;animation:boot-spin .8s linear infinite"></div>
            <p style="margin:0;font-size:13px;font-weight:600;color:#5f5e5e">Memuat panel…</p>
            <p id="boot-splash-hint" style="margin:0;max-width:320px;text-align:center;font-size:12px;color:#94a3b8"></p>
        </div>
        <style>@keyframes boot-spin{to{transform:rotate(360deg)}}</style>
        <script>
            // Jika aplikasi belum juga tampil, beri petunjuk agar pengguna bisa
            // memulihkan sendiri tanpa menebak-nebak.
            setTimeout(function () {
                var hint = document.getElementById('boot-splash-hint');
                if (hint) hint.textContent = 'Masih memuat… jika tidak berubah, muat ulang halaman ini.';
            }, 8000);
        </script>
    </div>
</body>
</html>
