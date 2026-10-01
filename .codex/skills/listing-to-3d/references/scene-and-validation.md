# Scene construction and validation

## Build a maintainable metric model

Keep source geometry, architecture, movable furnishings, context, camera presets and controls separable. Derive visual and collision geometry from the same source. Establish shell/window/door correctness before investing in small decor. Reuse primitives or model distinctive shapes where appropriate, but preserve the photographed arrangement rather than a generic staged room.

Use actual aperture cutouts for doors, windows, basins and niches. A transparent or dark rectangle applied to an opaque solid does not produce an opening. Keep service boxing and cupboard interiors no more detailed than the evidence supports. Account for skirtings, jambs and open door leaves that narrow real passages. Source plan wall offsets must also move frames and thresholds; an opening centred on the wrong wall baseline can leave a visible obstruction.

Treat furniture dimensions as shared evidence-based parameters, not per-photo adjustments. Fabrics, reflective surfaces, foliage and artwork may need simplified reconstruction; record that distinction. A mirror can reveal room topology: do not use a misleading arbitrary reflection. Exterior context explains views through openings but should not imply surveyed neighboring geometry.

Use restrained lighting consistent with the photographs. Do not compensate for wrong geometry with darkness, exposure, extreme lenses or decorative foliage. Repeated geometry can be instanced for performance. Asset licensing and provenance travel with the project; downloaded reference photos do not become freely licensed texture libraries.

## Navigation that respects the property

Use a body radius and body/eye height in metres. Keep the walking eye a fixed offset from the supporting floor; fly mode may pass through geometry intentionally. For stairs use actual tread/riser elevation or an evidence-consistent continuous collision ramp with visible treads, headroom checks and connected landings. Do not present teleportation between floors as walkable stairs.

Doorway floor polygons can be separated by wall thickness. Bridge only genuinely traversable door thresholds, with the actual opening width. Avoid an invisible seam across a visible open doorway. Test the union of floor regions so shared interior polygon edges do not act as barriers, while concave exterior boundaries block the entire body disk.

Check collisions against the body volume, including wall offsets, open leaves, frames, counters, chairs and tall objects. Rugs and safely overhead items should not block floor movement. Use collision substeps or a swept shape so fast movement cannot tunnel through walls. Preserve passage clearance after adding furnishings; do not shrink the viewer to an implausible point or delete obstacles to mask a routing error. Narrow legitimately impassable areas must be described rather than silently widened.

An overview cutaway is a visibility operation; collision remains consistent when walking. Free-look rotation must work around 360° horizontally with sensible pitch limits. Include a clear way to release mouse capture and a drag alternative. Use floor-relative room spawn points with body clearance.

## Compare rendered and source viewpoints

Use the source's aspect ratio and crop in the rendering pane. A horizontal FOV must be converted to the renderer's vertical FOV when necessary:

`verticalFov = 2 * atan(tan(horizontalFov / 2) / aspect)`

Use radians in calculations. Resize and update camera projection before capture; a newly selected portrait preset can otherwise save a stale landscape projection. Avoid saving a render before scene assets have loaded. Capture genuine scene output via a supported screenshot/capture path; do not claim a source image is a model render.

For contact sheets, create a JSON array of comparison pairs. Paths are relative to the JSON file. Optional crop values are normalized `[left, top, right, bottom]` rectangles:

```json
[
  {
    "id": "photo-12-left",
    "reference": "../sources/photo-12.jpg",
    "render": "../renders/photo-12-left.png",
    "reference_crop": [0, 0, 0.5, 1]
  }
]
```

Execute the bundled helper with Pillow available:

```text
python <skill-dir>/scripts/contact_sheet.py compare --pairs comparisons.json --output renders/comparison.jpg
```

Use a fresh output stem for each validation pass and review the paths printed by the helper; it preserves older sheets, including obsolete numbered pages from earlier runs. Review every property-photo view, not just an overview and hero shot. Check window/door sequences, silhouette edges, foreground occlusions, object proportions and sightlines through adjoining spaces. If a camera is inside a wall, shelf, cupboard or high furniture, correct the camera fit. A photo camera above low furniture may be legitimate; a walking spawn there is not. Compare again after geometry changes that affect other views. Keep a single final camera table and regenerate affected renders.

## Completion evidence

Perform meaningful tests against the fully furnished model: all room spawns, a continuous route through every real connection, both sides of every door threshold, stairs and landings where present, exterior concavities, window barriers, and long movement steps. Check blocked spaces remain inaccessible. A route through an empty shell is insufficient.

Through the actual viewer UI, verify loading, mode switches, walking, mouse look, room navigation, flight, source comparison and image capture. Use the supported browser tools; do not assume hidden UI APIs or unapproved automation surfaces. Test additional viewports only when permitted and relevant. Save a representative final render, comparison evidence and a validation report naming residual differences.

Report separately what was checked numerically, visually and interactively. Do not call an approximate camera fit “pixel aligned,” claim all-source validation after reviewing only a subset, or present a polished procedural reconstruction as photogrammetry. When runtime/browser tools are available, finish with a working local preview; otherwise preserve the runnable files and state which execution/visual checks could not be verified. Always provide portable run instructions. Use a free port and local-only binding rather than modifying unrelated running services.
