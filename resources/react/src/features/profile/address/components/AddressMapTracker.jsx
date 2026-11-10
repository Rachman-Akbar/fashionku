import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  forwardGeocode,
  reverseGeocode,
} from "@/features/profile/address/geocodingService";

const DEFAULT_CENTER = [-2.548926, 118.014863];

function createPinIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="width:34px;height:34px;border-radius:50% 50% 50% 0;background:#10B981;border:3px solid #ffffff;box-shadow:0 8px 20px rgba(15,23,42,.28);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;">
        <div style="width:10px;height:10px;border-radius:9999px;background:#ffffff;transform:rotate(45deg);"></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });
}

function formatCoordinate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(8) : "";
}

function getAddressSignature(values = {}) {
  return [
    values.fullAddress,
    values.subdistrict,
    values.district,
    values.cityOrRegency,
    values.province,
    values.postalCode,
    values.country,
  ]
    .map((value) =>
      String(value || "")
        .trim()
        .toLowerCase(),
    )
    .join("|");
}

function isAddressReady(values = {}) {
  return Boolean(
    String(values.province || "").trim() &&
      String(values.cityOrRegency || "").trim() &&
      String(values.district || "").trim() &&
      String(values.subdistrict || "").trim() &&
      String(values.fullAddress || "").trim(),
  );
}

export default function AddressMapTracker({
  latitude,
  longitude,
  addressValues,
  onCoordinateChange,
  onAddressResolved,
  compact = false,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const coordinateHandlerRef = useRef(onCoordinateChange);
  const addressHandlerRef = useRef(onAddressResolved);
  const lastAutomaticSearchRef = useRef("");
  const skipAutomaticSearchUntilRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  coordinateHandlerRef.current = onCoordinateChange;
  addressHandlerRef.current = onAddressResolved;

  const currentCoordinate = useMemo(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return [lat, lng];
  }, [latitude, longitude]);

  const setMapCoordinate = useCallback((lat, lng, zoom = 16) => {
    const coordinate = [lat, lng];
    mapRef.current?.setView(coordinate, zoom);
    markerRef.current?.setOpacity(1);
    markerRef.current?.setLatLng(coordinate);
    coordinateHandlerRef.current?.({
      latitude: formatCoordinate(lat),
      longitude: formatCoordinate(lng),
    });
  }, []);

  const resolveFromPoint = useCallback(
    async (lat, lng, successMessage) => {
      setMapCoordinate(lat, lng, 17);
      setLoading(true);
      setMessage("Membaca alamat dari OpenStreetMap...");

      try {
        const address = await reverseGeocode(lat, lng);
        skipAutomaticSearchUntilRef.current = Date.now() + 1800;
        lastAutomaticSearchRef.current = getAddressSignature(address);
        addressHandlerRef.current?.(address);
        setMessage(successMessage || "Lokasi berhasil ditemukan.");
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    },
    [setMapCoordinate],
  );

  const resolveFromForm = useCallback(
    async ({ automatic = false } = {}) => {
      if (!isAddressReady(addressValues)) {
        if (!automatic) {
          setMessage(
            "Lengkapi alamat, kelurahan, kecamatan, kota/kabupaten, dan provinsi terlebih dahulu.",
          );
        }
        return;
      }

      const signature = getAddressSignature(addressValues);

      if (automatic && signature === lastAutomaticSearchRef.current) {
        return;
      }

      setLoading(true);
      setMessage(
        automatic
          ? "Menyinkronkan pin dari form alamat..."
          : "Mencari lokasi dari data alamat...",
      );

      try {
        const result = await forwardGeocode(addressValues);
        lastAutomaticSearchRef.current = signature;
        skipAutomaticSearchUntilRef.current = Date.now() + 1200;
        setMapCoordinate(result.latitude, result.longitude, 16);
        addressHandlerRef.current?.(result.address);
        setMessage(
          automatic
            ? "Pin otomatis disesuaikan dari form alamat."
            : "Lokasi dari form berhasil ditemukan.",
        );
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    },
    [addressValues, setMapCoordinate],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const initialCoordinate = currentCoordinate || DEFAULT_CENTER;
    const map = L.map(containerRef.current, {
      center: initialCoordinate,
      zoom: currentCoordinate ? 16 : 5,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker(initialCoordinate, {
      draggable: true,
      icon: createPinIcon(),
    }).addTo(map);

    if (!currentCoordinate) {
      marker.setOpacity(0);
    }

    marker.on("dragend", () => {
      const point = marker.getLatLng();
      resolveFromPoint(point.lat, point.lng, "Pin berhasil dipindahkan.");
    });

    map.on("click", (event) => {
      resolveFromPoint(
        event.latlng.lat,
        event.latlng.lng,
        "Lokasi pada peta berhasil dipilih.",
      );
    });

    mapRef.current = map;
    markerRef.current = marker;

    window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !currentCoordinate) {
      return;
    }

    markerRef.current.setOpacity(1);
    markerRef.current.setLatLng(currentCoordinate);
  }, [currentCoordinate]);

  useEffect(() => {
    if (
      !isAddressReady(addressValues) ||
      Date.now() < skipAutomaticSearchUntilRef.current
    ) {
      return;
    }

    const signature = getAddressSignature(addressValues);

    if (!signature || signature === lastAutomaticSearchRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      resolveFromForm({ automatic: true });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [addressValues, resolveFromForm]);

  const locateCurrentPosition = () => {
    setMessage("");

    if (!navigator.geolocation) {
      setMessage("Browser tidak mendukung pembacaan lokasi.");
      return;
    }

    setLoading(true);
    setMessage("Mendeteksi lokasi perangkat...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await resolveFromPoint(
          position.coords.latitude,
          position.coords.longitude,
          "Lokasi perangkat berhasil digunakan.",
        );
      },
      (error) => {
        setLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setMessage(
            "Izin lokasi ditolak. Klik peta atau isi alamat secara manual.",
          );
          return;
        }

        setMessage("Lokasi perangkat tidak dapat dibaca.");
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      },
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-900">Pinpoint lokasi</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Klik peta, geser pin, gunakan lokasi perangkat, atau isi form alamat
            untuk sinkronisasi otomatis.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => resolveFromForm()}
            disabled={loading}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:border-[#10B981] hover:text-[#047857] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sinkronkan dari Form
          </button>
          <button
            type="button"
            onClick={locateCurrentPosition}
            disabled={loading}
            className="h-10 rounded-xl bg-[#10B981] px-3 text-xs font-black text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Gunakan Lokasi Saya
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`${compact ? "h-[280px]" : "h-[360px]"} w-full overflow-hidden rounded-2xl border border-slate-200 bg-white`}
      />

      {message ? (
        <p
          className={`text-xs font-semibold ${message.includes("berhasil") || message.includes("otomatis") ? "text-[#10B981]" : "text-slate-500"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
