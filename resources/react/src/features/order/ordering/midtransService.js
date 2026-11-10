let snapScriptPromise = null;

function getMidtransClientKey(order = {}) {
  return String(
    order.midtransClientKey || import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "",
  ).trim();
}

function isProduction(order = {}) {
  if (typeof order.midtransIsProduction === "boolean") {
    return order.midtransIsProduction;
  }

  return (
    String(
      import.meta.env.VITE_MIDTRANS_IS_PRODUCTION || "false",
    ).toLowerCase() === "true"
  );
}

export function loadMidtransSnap(order = {}) {
  if (window.snap) {
    return Promise.resolve(window.snap);
  }

  if (snapScriptPromise) {
    return snapScriptPromise;
  }

  const clientKey = getMidtransClientKey(order);

  if (!clientKey) {
    return Promise.reject(
      new Error(
        "Midtrans Client Key frontend belum tersedia. Isi VITE_MIDTRANS_CLIENT_KEY lalu build ulang frontend.",
      ),
    );
  }

  const src = isProduction(order)
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  snapScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.clientKey = clientKey;
    script.onload = () => {
      if (window.snap) {
        resolve(window.snap);
        return;
      }

      reject(new Error("Midtrans Snap tidak tersedia setelah script dimuat."));
    };
    script.onerror = () => reject(new Error("Midtrans Snap gagal dimuat."));
    document.head.appendChild(script);
  }).catch((error) => {
    snapScriptPromise = null;
    throw error;
  });

  return snapScriptPromise;
}

export async function openMidtransPayment(order, callbacks = {}) {
  const paymentUrl = order.paymentUrl || order.redirectUrl;

  if (paymentUrl) {
    window.location.assign(paymentUrl);
    return "redirect";
  }

  if (!order.snapToken) {
    throw new Error(
      "Backend belum mengirim snap_token atau payment_url untuk pesanan ini.",
    );
  }

  const snap = await loadMidtransSnap(order);

  snap.pay(order.snapToken, {
    onSuccess: callbacks.onSuccess,
    onPending: callbacks.onPending,
    onError: callbacks.onError,
    onClose: callbacks.onClose,
  });

  return "snap";
}
