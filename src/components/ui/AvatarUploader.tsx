"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

interface AvatarUploaderProps {
  currentUrl?: string | null;
  firstName?: string;
  lastName?: string;
}

/**
 * Recorta la imagen según el área seleccionada por el Cropper y devuelve un Blob JPEG.
 */
async function getCroppedBlob(imageSrc: string, crop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  // Salida cuadrada (el crop siempre es aspect 1:1)
  const outputSize = Math.min(crop.width, 512); // máx 512px para no subir archivos enormes
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Error al recortar"))),
      "image/jpeg",
      0.9
    );
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Modal de crop — renderizado via portal en <body> para evitar problemas
// de stacking context con el form padre.
// ────────────────────────────────────────────────────────────────────────────
function CropModal({
  imageSrc,
  isUploading,
  onConfirm,
  onCancel,
}: {
  imageSrc: string;
  isUploading: boolean;
  onConfirm: (croppedArea: Area) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.65)",
      }}
      // Cerrar con click en backdrop
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) onCancel();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "100%",
          maxWidth: 440,
          margin: "0 16px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB" }}>
          <h2
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#1C1917",
              margin: 0,
              fontSize: 16,
            }}
          >
            Recortar foto
          </h2>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
            Arrastrá y hacé zoom para encuadrar la foto
          </p>
        </div>

        {/* Crop area — DEBE tener position relative + altura explícita */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 320,
            background: "#1C1917",
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div
          style={{
            padding: "12px 20px",
            background: "#F6F7F9",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12, color: "#6B7280", whiteSpace: "nowrap" }}>Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#CC4E0D" }}
          />
        </div>

        {/* Actions */}
        <div
          style={{
            padding: "14px 20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            style={{
              fontSize: 14,
              color: "#6B7280",
              padding: "8px 16px",
              background: "none",
              border: "none",
              cursor: isUploading ? "not-allowed" : "pointer",
              opacity: isUploading ? 0.5 : 1,
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => croppedAreaPixels && onConfirm(croppedAreaPixels)}
            disabled={isUploading || !croppedAreaPixels}
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              padding: "8px 20px",
              background: isUploading ? "#d4845a" : "#CC4E0D",
              border: "none",
              borderRadius: 10,
              cursor: isUploading ? "not-allowed" : "pointer",
              opacity: isUploading || !croppedAreaPixels ? 0.6 : 1,
            }}
          >
            {isUploading ? "Subiendo…" : "Confirmar recorte"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Componente principal
// ────────────────────────────────────────────────────────────────────────────
export default function AvatarUploader({ currentUrl, firstName, lastName }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials =
    firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : "?";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);
    setShowModal(true);
    e.target.value = "";
  };

  const handleConfirmCrop = async (croppedAreaPixels: Area) => {
    if (!previewSrc) return;
    setIsUploading(true);
    setError(null);
    try {
      const blob = await getCroppedBlob(previewSrc, croppedAreaPixels);
      const fd = new FormData();
      fd.append("file", blob, "avatar.jpg");

      const res = await fetch("/api/admin/upload-avatar", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al subir la imagen");

      setUploadedUrl(json.url);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setPreviewSrc(null);
  };

  const handleRemove = () => {
    setUploadedUrl(null);
    setError(null);
  };

  return (
    <>
      {/* Hidden input — viaja con el form al server action */}
      <input type="hidden" name="avatar_url" value={uploadedUrl ?? ""} />

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-[#1C1917]">Foto de perfil</span>

        <div className="flex items-center gap-4">
          {/* Avatar preview */}
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#E5E7EB] flex items-center justify-center shrink-0 border-2 border-[#E5E7EB]">
            {uploadedUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={uploadedUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-[#6B7280]">{initials}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm px-3 py-1.5 rounded-[10px] border border-[#E5E7EB] bg-white text-[#1C1917] hover:border-[#CC4E0D] hover:text-[#CC4E0D] transition-colors cursor-pointer"
            >
              {uploadedUrl ? "Cambiar foto" : "Subir foto"}
            </button>
            {uploadedUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-[#B42318] hover:underline text-left cursor-pointer"
              >
                Eliminar foto
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-[#6B7280]">JPG, PNG o WEBP. Se recortará en forma circular.</p>
        {error && <p className="text-xs text-[#B42318]">{error}</p>}
      </div>

      {/* File input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Modal crop — vía portal fuera del DOM del form */}
      {showModal && previewSrc && (
        <CropModal
          imageSrc={previewSrc}
          isUploading={isUploading}
          onConfirm={handleConfirmCrop}
          onCancel={() => {
            if (!isUploading) closeModal();
          }}
        />
      )}
    </>
  );
}
