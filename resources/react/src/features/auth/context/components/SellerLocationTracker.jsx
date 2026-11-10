import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  reverseOpenStreetMap,
  searchOpenStreetMap,
} from "@/features/auth/services/openStreetMapService";

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

export default function SellerLocationTracker({
  latitude,
  longitude,
  addressValues,
  onCoordinateChange,
  onAddressResolved,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const coordinateHandlerRef = useRef(onCoordinateChange);
  const addressHandlerRef = useRef(onAddressResolved);
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

    const updateFromPoint = async (lat, lng) => {
      marker.setOpacity(1);
      marker.setLatLng([lat, lng]);
      coordinateHandlerRef.current?.({
        latitude: formatCoordinate(lat),
        longitude: formatCoordinate(lng),
      });
      setLoading(true);
      setMessage("Membaca alamat dari OpenStreetMap...");

      try {
        const address = await reverseOpenStreetMap(lat, lng);
        addressHandlerRef.current?.(address);
        setMessage("Lokasi berhasil ditemukan.");
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    marker.on("dragend", () => {
      const point = marker.getLatLng();
      updateFromPoint(point.lat, point.lng);
    });

    map.on("click", (event) => {
      updateFromPoint(event.latlng.lat, event.latlng.lng);
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
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        mapRef.current?.setView([lat, lng], 17);
        markerRef.current?.setOpacity(1);
        markerRef.current?.setLatLng([lat, lng]);
        coordinateHandlerRef.current?.({
          latitude: formatCoordinate(lat),
          longitude: formatCoordinate(lng),
        });

        try {
          const address = await reverseOpenStreetMap(lat, lng);
          addressHandlerRef.current?.(address);
          setMessage("Lokasi perangkat berhasil digunakan.");
        } catch (error) {
          setMessage(error.message);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setMessage(
            "Izin lokasi ditolak. Klik peta atau cari lokasi dari form.",
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

  const locateFromForm = async () => {
    setLoading(true);
    setMessage("Mencari lokasi dari data alamat...");

    try {
      const result = await searchOpenStreetMap(addressValues);
      const coordinate = [result.latitude, result.longitude];

      mapRef.current?.setView(coordinate, 16);
      markerRef.current?.setOpacity(1);
      markerRef.current?.setLatLng(coordinate);
      coordinateHandlerRef.current?.({
        latitude: formatCoordinate(result.latitude),
        longitude: formatCoordinate(result.longitude),
      });
      addressHandlerRef.current?.(result.address);
      setMessage("Lokasi dari form berhasil ditemukan.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-900">
            Pinpoint lokasi toko
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Klik peta, geser pin, gunakan lokasi perangkat, atau cari dari
            alamat yang sudah diisi.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={locateFromForm}
            disabled={loading}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:border-[#10B981] hover:text-[#10B981] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cari dari Form
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
        className="h-[360px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
      />

      {message ? (
        <p
          className={`text-xs font-semibold ${message.includes("berhasil") ? "text-[#10B981]" : "text-slate-500"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
