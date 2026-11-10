<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesanan Dibatalkan - MarketKu</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    <tr>
                        <td style="padding:40px 40px 24px;text-align:center;">
                            <div style="display:inline-block;width:48px;height:48px;border-radius:12px;background-color:#EF4444;color:#ffffff;font-size:20px;font-weight:900;line-height:48px;">M</div>
                            <h1 style="margin:16px 0 8px;font-size:24px;font-weight:900;color:#0f172a;">Pesanan Dibatalkan</h1>
                            <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">Hai {{ $recipientName }}, pesanan kamu telah dibatalkan.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 40px 32px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding:20px;background-color:#fef2f2;border-radius:12px;border:1px solid #fecaca;">
                                        <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Nomor Pesanan</p>
                                        <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#0f172a;">#{{ $orderNumber }}</p>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #fecaca;">
                                            <tr>
                                                <td style="padding:12px 0 0;">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Total</p>
                                                    <p style="margin:0;font-size:16px;font-weight:700;color:#334155;">Rp {{ $totalAmount }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 0 0;">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Alasan Pembatalan</p>
                                                    <p style="margin:0;font-size:14px;font-weight:600;color:#334155;">{{ $reason }}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 40px 32px;text-align:center;">
                            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                                <tr>
                                    <td style="background-color:#10B981;border-radius:10px;">
                                        <a href="{{ $orderUrl }}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;">Lihat Detail</a>
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
