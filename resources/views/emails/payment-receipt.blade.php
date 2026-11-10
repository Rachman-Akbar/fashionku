<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bukti Pembayaran - Ziip</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    <tr>
                        <td style="background-color:#10B981;padding:32px 40px;text-align:center;">
                            <div style="display:inline-block;width:48px;height:48px;border-radius:12px;background-color:#ffffff;color:#10B981;font-size:20px;font-weight:900;line-height:48px;">Z</div>
                            <h1 style="margin:16px 0 4px;font-size:22px;font-weight:900;color:#ffffff;">Pembayaran Berhasil</h1>
                            <p style="margin:0;font-size:14px;color:#d1fae5;">Terima kasih, {{ $buyerName }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px 40px 8px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                                <tr>
                                    <td style="padding:20px;">
                                        <p style="margin:0 0 16px;font-size:13px;color:#64748b;text-align:center;">Berikut adalah bukti pembayaran transaksi digital kamu.</p>

                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:6px 0;" colspan="2">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Produk / Layanan</p>
                                                    <p style="margin:0;font-size:15px;font-weight:700;color:#0f172a;">{{ $productName }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;width:50%;">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Kategori</p>
                                                    <p style="margin:0;font-size:14px;font-weight:600;color:#334155;">{{ $category ?? '-' }}</p>
                                                </td>
                                                <td style="padding:6px 0;">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Tipe</p>
                                                    <p style="margin:0;font-size:14px;font-weight:600;color:#334155;">{{ $productType }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;width:50%;">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Nomor Pelanggan</p>
                                                    <p style="margin:0;font-size:14px;font-weight:600;color:#334155;">{{ $customerId ?? '-' }}</p>
                                                </td>
                                                <td style="padding:6px 0;">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Waktu Bayar</p>
                                                    <p style="margin:0;font-size:14px;font-weight:600;color:#334155;">{{ $paidAt }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;width:50%;">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Referensi</p>
                                                    <p style="margin:0;font-size:14px;font-weight:600;color:#334155;">{{ $referenceId }}</p>
                                                </td>
                                                <td style="padding:6px 0;">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">TRID</p>
                                                    <p style="margin:0;font-size:14px;font-weight:600;color:#334155;">{{ $trId ?? '-' }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0 0;width:50%;">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Serial Number (SN)</p>
                                                    <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">{{ $sn }}</p>
                                                </td>
                                                <td style="padding:6px 0 0;">
                                                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Metode Bayar</p>
                                                    <p style="margin:0;font-size:14px;font-weight:700;text-transform:uppercase;color:#0f172a;">{{ $paymentMethod }}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding:8px 0;">
                                        <p style="margin:0;font-size:13px;color:#64748b;">Pembayaran dikonfirmasi. Nomor/SN produk digital telah tersedia di detail transaksi.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;">
                                        <p style="margin:0;font-size:12px;color:#94a3b8;">Biaya Admin</p>
                                        <p style="margin:0;font-size:15px;font-weight:600;color:#334155;">Rp {{ $adminFee }}</p>
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
                                        <a href="{{ $receiptUrl }}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;">Lihat Detail Transaksi</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
                            <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">Email ini dikirim secara otomatis oleh Ziip. Jangan membalas email ini.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
