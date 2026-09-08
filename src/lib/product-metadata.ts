import type { MetadataField } from "./types";

export const METADATA_SCHEMAS: Record<string, MetadataField[]> = {
  coffee: [
    { key: "origin", label: "Origin", placeholder: "e.g. Kirinyaga, Kenya" },
    { key: "region", label: "Region", placeholder: "e.g. Central Province" },
    { key: "altitude", label: "Altitude", placeholder: "e.g. 1,600–1,850m" },
    { key: "variety", label: "Variety", placeholder: "e.g. SL28, SL34, Ruiru 11" },
    { key: "processing", label: "Processing", placeholder: "e.g. Washed, Natural, Anaerobic" },
    { key: "grade", label: "Grade", placeholder: "e.g. AA, AB, PB" },
    { key: "sca_score", label: "SCA Score", placeholder: "e.g. 84+" },
    { key: "harvest", label: "Harvest", placeholder: "e.g. October 2025" },
    { key: "tasting_notes", label: "Tasting notes", placeholder: "e.g. Blackcurrant, caramel, citrus" },
  ],
  tea: [
    { key: "origin", label: "Origin", placeholder: "e.g. Kericho, Kenya" },
    { key: "elevation", label: "Elevation", placeholder: "e.g. 1,500–2,100m" },
    { key: "grade", label: "Grade", placeholder: "e.g. FBOP, BOP, OP" },
    { key: "leaf_style", label: "Leaf style", placeholder: "e.g. Orthodox, CTC" },
    { key: "harvest", label: "Harvest", placeholder: "e.g. First flush, 2025" },
    { key: "tasting_notes", label: "Tasting notes", placeholder: "e.g. Malty, brisk, golden liquor" },
  ],
  horticulture: [
    { key: "origin", label: "Origin", placeholder: "e.g. Nakuru, Kenya" },
    { key: "variety", label: "Variety", placeholder: "e.g. Hass, Fuerte" },
    { key: "seasonality", label: "Seasonality", placeholder: "e.g. Year-round" },
    { key: "grade", label: "Grade", placeholder: "e.g. Class 1, Export" },
    { key: "pack_sizes", label: "Pack sizes", placeholder: "e.g. 4kg, 10kg" },
  ],
  grains: [
    { key: "origin", label: "Origin", placeholder: "e.g. Uasin Gishu, Kenya" },
    { key: "variety", label: "Variety", placeholder: "e.g. Hybrid 513, KTB 9" },
    { key: "grade", label: "Grade", placeholder: "e.g. Grade 1" },
    { key: "moisture", label: "Moisture content", placeholder: "e.g. ≤13%" },
    { key: "packaging", label: "Packaging", placeholder: "e.g. 50kg bags" },
  ],
};

export const METADATA_LABELS: Record<string, string> = {
  coffee: "Coffee",
  tea: "Tea",
  horticulture: "Horticultural",
  grains: "Grains",
};

export function getMetadataFieldsForCategory(categorySlug: string): MetadataField[] {
  return METADATA_SCHEMAS[categorySlug] ?? [];
}
