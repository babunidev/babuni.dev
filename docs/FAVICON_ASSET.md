# Favicon Asset — Provenance and Publication

## Current asset

The website uses `public/favicon.webp` as its browser icon and as the small mark beside the BABUNI.DEV header text. The file is present in the Git repository at **7,926 bytes**. The homepage currently references it using `/favicon.webp?v=b-mark-1` with `type="image/webp"` and `sizes="64x64"`. These statements were checked against the Git tree and `src/pages/index.astro` on **2026-11-01**; no browser-tab test was performed during this documentation review.

The favicon is an asset of the **babuni.dev** portfolio. The human creative is **Babuni**; the website name is not the person's name.

## Origin and attribution

At the time, I supplied an original image named `Enchanted Stone Portal Logo.png` and requested a browser icon containing only the large stone letter **B**, without the accompanying wordmark. At the time, my direction was to preserve the original graphic's recognizable cracked stone, foliage, blue light, and warm portal glow rather than invent a different logo.

AI performed an image-editing pass with the image editor, then used Pillow to crop transparent margins and resize the result to a square 64 × 64 WebP with alpha. The reported output was lossless WebP. **The edit may have reconstructed or redrawn fine details; pixel-for-pixel equivalence to the supplied artwork is not claimed.** The original supplied file was not modified. It is not present in the current Git tree, so this repository does not claim to archive the original source.

## Historical editing instruction

The original image-edit instruction was to isolate the existing letter B above the BABUNI DEV wordmark, remove the lettering and unused canvas, center the extracted emblem on genuine transparency, and retain the original stone cracks, foliage, blue left light, golden-orange portal glow, and cat-like face. No additional lettering or intentional redesign was requested.

This records creative intent and the AI editing process, **not a reproducible claim of exact pixel preservation**. The earlier complete prompt can be recovered from Git history if needed.

## Verification and limitations

At the time of the original favicon work, the recorded checks found that the image decoded as a **64 × 64 WebP with alpha**, and that **140 Node tests and the production build passed** in that earlier implementation session. A browser DOM inspection found the favicon metadata and no Astro toolbar elements. These are **dated historical results**, not tests rerun for this review.

The current repository check confirmed the favicon file and the homepage's icon/header references. It did **not** independently decode the current image, inspect browser-tab chrome on physical devices, or rerun tests and builds.

For the visual-design context, see [Design](DESIGN.md). For website-ready image conventions and evidence requirements, see [Visual documentation](VISUAL_DOCUMENTATION.md).

## Document scope

This file is a small, historical asset-provenance record. Its facts may eventually be consolidated into the visual-design documentation, provided the original creative direction, AI contribution, limitations, and historical verification remain accessible.
