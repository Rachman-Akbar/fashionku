<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - MarketKu</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    <tr>
                        <td style="padding:40px 40px 24px;text-align:center;">
                            <div style="display:inline-block;width:48px;height:48px;border-radius:12px;background-color:#10B981;color:#ffffff;font-size:20px;font-weight:900;line-height:48px;">M</div>
                            <h1 style="margin:16px 0 8px;font-size:24px;font-weight:900;color:#0f172a;">Reset Password</h1>
                            <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">Kami menerima permintaan reset password untuk akun kamu.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 40px 32px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding:20px;background-color:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                                        <p style="margin:0 0 12px;font-size:14px;color:#334155;">Klik tombol di bawah untuk mereset password kamu:</p>
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="background-color:#10B981;border-radius:10px;">
                                                    <a href="{{ $url }}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;">Reset Password</a>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;line-height:1.5;">Link ini akan kedaluwarsa dalam {{ $expiresAt ?? '60 menit' }}. Jika kamu tidak meminta reset password, abaikan email ini.</p>
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
