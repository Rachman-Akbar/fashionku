<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode Verifikasi - MarketKu</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    <tr>
                        <td style="padding:40px 40px 24px;text-align:center;">
                            <div style="display:inline-block;width:48px;height:48px;border-radius:12px;background-color:#10B981;color:#ffffff;font-size:20px;font-weight:900;line-height:48px;">M</div>
                            <h1 style="margin:16px 0 8px;font-size:24px;font-weight:900;color:#0f172a;">Kode Verifikasi</h1>
                            <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">Gunakan kode berikut untuk mengamankan akun MarketKu kamu.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 40px 32px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding:28px 24px;background-color:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;text-align:center;">
                                        <p style="margin:0 0 14px;font-size:14px;color:#334155;">Kode verifikasi kamu:</p>
                                        <div style="display:inline-block;padding:18px 36px;background-color:#10B981;border-radius:12px;color:#ffffff;font-size:32px;font-weight:900;letter-spacing:10px;">{{ $code }}</div>
                                        <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;line-height:1.5;">Kode ini akan kedaluwarsa dalam {{ $expiresAt ?? '10 menit' }}. Jangan bagikan kode ini kepada siapa pun, termasuk pihak yang mengaku dari MarketKu.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
                            <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">Email ini dikirim secara otomatis oleh MarketKu. Jangan membalas email ini.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>