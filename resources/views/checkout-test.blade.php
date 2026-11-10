<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sandbox Testing: Create Order & Midtrans</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <script type="text/javascript" src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="{{ config('midtrans.client_key') }}"></script>
</head>
<body class="bg-light">
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">DDD E-Commerce Order Test Engine</h4>
                    </div>
                    <div class="card-body">
                        <form id="orderForm">
                            <h5 class="text-secondary border-bottom pb-2">1. Authentication</h5>
                            <div class="mb-3">
                                <label class="form-label">Bearer Token (Sanctum)</label>
                                <textarea id="token" class="form-control" rows="2" placeholder="Bearer 1|xyz..."></textarea>
                            </div>

                            <h5 class="text-secondary border-bottom pb-2 mt-4">2. Order Payload</h5>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Address ID</label>
                                    <input type="number" id="address_id" class="form-control" value="1" placeholder="Isi null jika ambil sendiri">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Cart Item IDs (Pisahkan dengan koma)</label>
                                    <input type="text" id="cart_item_ids" class="form-control" value="12,15">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Kurir (Courier)</label>
                                    <select id="courier" class="form-select">
                                        <option value="jne">JNE (RajaOngkir)</option>
                                        <option value="express">Express (Internal Haversine)</option>
                                        <option value="ambil_sendiri">Ambil Sendiri (Tanpa Ongkir)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Metode Pembayaran</label>
                                    <select id="payment_method" class="form-select">
                                        <option value="midtrans">Midtrans Gateway</option>
                                        <option value="cod">Cash on Delivery (COD)</option>
                                        <option value="transfer_manual">Transfer Manual</option>
                                        <option value="tunai_toko">Bayar Tunai di Toko</option>
                                    </select>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Kode Voucher (Opsional)</label>
                                <input type="text" id="voucher_code" class="form-control" value="DISKONHEMAT">
                            </div>

                            <button type="button" id="btnSubmit" class="btn btn-success w-100 mt-3 py-2 fw-bold">PROSES ORDER</button>
                        </form>
                    </div>
                </div>

                <div class="card mt-4 bg-dark text-light">
                    <div class="card-header bg-secondary text-white small">Response Console Log</div>
                    <div class="card-body">
                        <pre id="logOutput" class="mb-0 small" style="white-space: pre-wrap; word-wrap: break-word;">Awaiting interaction...</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('btnSubmit').addEventListener('click', async function() {
            const logBox = document.getElementById('logOutput');
            const token = document.getElementById('token').value.trim();

            // Parsing Array Cart Item IDs
            const cartItemsRaw = document.getElementById('cart_item_ids').value;
            const cartItemIds = cartItemsRaw.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

            // Bangun Payload
            const payload = {
                address_id: document.getElementById('address_id').value ? parseInt(document.getElementById('address_id').value) : null,
                cart_item_ids: cartItemIds,
                courier: document.getElementById('courier').value,
                payment_method: document.getElementById('payment_method').value,
                voucher_code: document.getElementById('voucher_code').value.trim() || null
            };

            logBox.innerText = "Sending request...\n" + JSON.stringify(payload, null, 2);

            try {
                // Sesuai route prefix kamu di api.php
                const response = await fetch('/api/v1/order/orderings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': token.startsWith('Bearer ') ? token : 'Bearer ' + token
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                logBox.innerText = "Response Received:\n" + JSON.stringify(result, null, 2);

                if (!response.ok) {
                    alert('Gagal membuat order: ' + (result.message || 'Error internal'));
                    return;
                }

                // Mengecek ketersediaan token di data mentah map ataupun resource wrapper
                const snapToken = result.data?.snap_token || result.snap_token || result.data?.snapToken || result.snapToken;

                if (payload.payment_method === 'midtrans' && snapToken) {
                    logBox.innerText += "\n\nTriggering Midtrans Snap Pop-up...";

                    window.snap.pay(snapToken, {
                        onSuccess: function(res) {
                            alert("Pembayaran Berhasil!");
                            console.log(res);
                        },
                        onPending: function(res) {
                            alert("Menunggu Pembayaran!");
                            console.log(res);
                        },
                        onError: function(res) {
                            alert("Pembayaran Gagal!");
                            console.log(res);
                        },
                        onClose: function() {
                            alert('Anda menutup pop-up sebelum menyelesaikan pembayaran.');
                        }
                    });
                } else {
                    alert('Order Berhasil Dibuat! (Metode Non-Midtrans, tidak memicu pop-up)');
                }

            } catch (error) {
                logBox.innerText = "Error Exception:\n" + error.message;
                alert('Terjadi kesalahan koneksi/sistem.');
            }
        });
    </script>
</body>
</html>
