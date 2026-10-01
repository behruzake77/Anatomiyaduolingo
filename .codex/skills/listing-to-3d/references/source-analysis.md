# Source analysis and spatial inference

## Collect a complete evidence set

Use stable IDs independent of download order. Record the listing's advertised gallery totals and reconcile them against downloaded originals, duplicates, diptychs and plans. A successful HTTP response is not proof of an image: decode it or inspect it; login/challenge HTML can masquerade as media. Preserve URLs and any relevant retrieval date without exposing private authentication data.

Inspect full-size stills, plan dimensions and embedded viewer content. Tours may expose original panoramas, and a plan viewer may expose structured public geometry. Prefer these when actually discovered in the authorized page. Do not guess private endpoints, project IDs, bucket paths or obsolete URL patterns. The fact that one Funda listing used Floorplanner and CloudPano is not a requirement or guarantee for another listing. Some legitimate public downloads require the listing browser session; if permissible retrieval remains blocked, report the exact gap.

For video, inspect representative frames throughout its actual duration and revisit unique transitions. Record features visible only in the video. For panoramas, inspect enough directions to see hidden sides and room connectivity; do not interpret a spherical image's distorted angles as a rectilinear photo lens.

## Establish metric geometry

Preserve a raw source copy and record the transform to metres: units, origin, axis directions, handedness, rotation and vertical datum. Apply the same transform to walls, openings, placed objects, floors, cameras, fixtures and collision. Verify handedness using asymmetric landmarks from at least two opposing photos before furnishing the full model. A visually mirrored scene can still look plausible from one camera.

Structured source geometry needs interpretation:

- A wall baseline may be a centre line or an offset line. Derive both finished faces, including asymmetric wall balance, before locating frames or collision boundaries.
- Preserve actual thicknesses, offsets and recesses; resolve joins without silently thickening rooms. Distinguish clear dimensions, centre-line lengths, exterior dimensions and marketed area.
- Named floor surfaces can subdivide one open room. A label boundary does not establish a partition.
- Catalogue sills, doors and ceiling heights may be defaults. Explicit dimension annotations carry more weight. Flag inferred vertical adjustments instead of presenting them as measured.
- Export/orbit cameras and catalogue furniture in a floor-plan editor are schematic; they are not calibrated listing-photo cameras or reliable interior styling.
- Closed cupboards, shafts, communal circulation and neighbors may be visible in a plan without belonging to the walkable property.

If only a raster plan is available, trace wall faces/openings, calibrate from visible dimension lines and cross-check several independent spans. Keep measurement uncertainty proportional to image resolution. Do not claim millimetre precision from decimal coordinates or marketing drawings. Missing individual dimensions can be inferred from a calibrated plan; missing plans must be reported according to the entrypoint's source requirement.

For multiple floors, align stair openings, shafts and structural boundaries in a common horizontal frame. Establish each finished-floor elevation and ceiling separately; do not flatten levels into one floor or reuse a single-floor collision method unmodified.

## Match photos and cameras

Build a graph of spaces and openings, then place each view using several independent anchors: window count/spacing, door/window distinction, wall returns, radiator positions, cabinet order, floor changes, soffits, reflected views and adjoining rooms. Distinguish the existing layout from proposed renovation plans; do not silently reconstruct a proposal. Keep confidence separate for room identity and camera pose. Opposing photos and panoramas are especially useful for disambiguation.

A useful per-view record is:

```json
{
  "id": "view-id",
  "source_id": "asset-id",
  "level": "level-id",
  "room": "room-id",
  "eye_m": [0, 0, 0],
  "target_m": [0, 0, 1],
  "horizontal_fov_degrees": 75,
  "image_aspect": 1.5,
  "crop_normalized": null,
  "match_confidence": "high",
  "pose_confidence": "estimated",
  "anchors": [],
  "notes": ""
}
```

The zero coordinates above illustrate the schema; calculate real poses from this property. Store FOV convention explicitly. Handle verticals corrected by real-estate photography as a camera/projection issue rather than bending the room. Save independent crop rectangles and cameras for each panel of a composite image. Distinguish reflections from additional rooms or duplicate objects. If the original lens/pose cannot be solved uniquely, retain an approximate fit and describe the residual.

## Useful reconstruction-map structure

Keep source inventory, per-space correspondence, metric constraints, opening/connection table, camera records, appearance inventory and uncertainty decisions in readable files beside normalized geometry. Include actual evidence IDs for each inferred item. The analysis is a decision record that implementation follows, not a report written after inventing the scene.
