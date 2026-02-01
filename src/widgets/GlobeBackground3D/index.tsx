import { lazy, memo, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";
import { useScrollRotation } from "@/shared/lib/useScrollRotation";

const LazyGlobe = lazy(() =>
  import("react-globe.gl").then((m) => ({ default: m.default }))
);

type CityPoint = {
  name: string;
  lat: number;
  lng: number;
  size?: number;
};

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl", { alpha: true }) ||
      canvas.getContext("experimental-webgl", { alpha: true });
    return Boolean(gl);
  } catch {
    return false;
  }
}

const Loading = () => null;

export const GlobeBackground3D = memo(function GlobeBackground3D({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const globeRef = useRef<GlobeMethods | null>(null);
  const [size, setSize] = useState(420);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isWebGLAvailable());
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recalc = () => {
      const w = Math.max(0, window.innerWidth - 10);
      const next = Math.max(360, Math.min(1600, w));
      setSize(next);
    };

    recalc();

    window.addEventListener("resize", recalc, { passive: true });
    return () => window.removeEventListener("resize", recalc);
  }, [containerRef]);

  useEffect(() => {
    if (!enabled) return;
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    if (controls) {
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableRotate = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
    }

    globe.pointOfView({ altitude: 1.85 }, 0);
  }, [enabled]);

  useScrollRotation(containerRef, (deg) => {
    const globe = globeRef.current;
    if (!globe) return;
    const scene = globe.scene();
    if (!scene) return;
    scene.rotation.y = (deg * Math.PI) / 180;
  });

  const earthDarkUrl = useMemo(() => {
    return new URL(
      `${import.meta.env.BASE_URL}globe/earth-blue-marble.jpg`,
      window.location.origin
    ).toString();
  }, []);

  const earthTopoUrl = useMemo(() => {
    return new URL(
      `${import.meta.env.BASE_URL}globe/earth-topology.png`,
      window.location.origin
    ).toString();
  }, []);

  const cities: CityPoint[] = useMemo(
    () => [
      { name: "Tashkent", lat: 41.2995, lng: 69.2401, size: 0.06 },
      { name: "Samarkand", lat: 39.6542, lng: 66.9597, size: 0.045 },
      { name: "Moscow", lat: 55.7558, lng: 37.6173, size: 0.06 },
      { name: "Istanbul", lat: 41.0082, lng: 28.9784, size: 0.055 },
      { name: "Dubai", lat: 25.2048, lng: 55.2708, size: 0.05 },
      { name: "Tehran", lat: 35.6892, lng: 51.389, size: 0.05 },
      { name: "Almaty", lat: 43.2389, lng: 76.8897, size: 0.045 },
      { name: "Baku", lat: 40.4093, lng: 49.8671, size: 0.04 },
      { name: "Tbilisi", lat: 41.7151, lng: 44.8271, size: 0.04 },
      { name: "Kyiv", lat: 50.4501, lng: 30.5234, size: 0.045 },
      { name: "Warsaw", lat: 52.2297, lng: 21.0122, size: 0.04 },
      { name: "Berlin", lat: 52.52, lng: 13.405, size: 0.04 },
      { name: "Paris", lat: 48.8566, lng: 2.3522, size: 0.04 },
      { name: "London", lat: 51.5074, lng: -0.1278, size: 0.04 },
      { name: "New York", lat: 40.7128, lng: -74.006, size: 0.05 },
      { name: "Tokyo", lat: 35.6762, lng: 139.6503, size: 0.05 },
      { name: "Seoul", lat: 37.5665, lng: 126.978, size: 0.045 },
      { name: "Beijing", lat: 39.9042, lng: 116.4074, size: 0.05 },
      { name: "Delhi", lat: 28.6139, lng: 77.209, size: 0.05 },
      { name: "Singapore", lat: 1.3521, lng: 103.8198, size: 0.04 },
    ],
    []
  );

  const rings = useMemo(() => {
    return cities.slice(0, 10).map((c) => ({
      lat: c.lat,
      lng: c.lng,
      maxR: 2.2,
      propagationSpeed: 1.6,
      repeatPeriod: 1800 + Math.random() * 900,
    }));
  }, [cities]);

  if (!enabled) return null;

  return (
    <div className="globe3d-layer" aria-hidden="true">
      <Suspense fallback={<Loading />}>
        <LazyGlobe
          ref={globeRef as unknown as React.RefObject<GlobeMethods>}
          width={size}
          height={size}
          rendererConfig={{ antialias: true, alpha: true }}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={earthDarkUrl}
          bumpImageUrl={earthTopoUrl}
          showAtmosphere
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.22}
          enablePointerInteraction={false}
          pointsData={cities}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={(d) => (d as CityPoint).size ?? 0.04}
          pointRadius={0.22}
          pointColor={() => "rgba(255,122,0,0.9)"}
          ringsData={rings}
          ringColor={() => "rgba(59,130,246,0.25)"}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
        />
      </Suspense>
    </div>
  );
});
