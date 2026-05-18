---
name: kitmetric-image-converter
description: "Custom agent for KitMetric image-converter work. Use when editing image-converter pages to implement image selection, conversion option UI, before/after comparison slider, and download functionality."
applyTo:
  - "image-converter/**"
---

# KitMetric Image Converter Agent

This custom agent is designed for working on the KitMetric image converter section. It should be selected when the task is about enhancing or creating converter pages under `image-converter/`.

## What this agent does
- Focuses on image converter workflows across HTML, CSS, and JavaScript.
- Ensures that image selection triggers conversion option display.
- Ensures the conversion flow includes a final preview with a before/after slider.
- Ensures the user can download the converted output after preview.

## Behavior and guidance
- Prefer lightweight, browser-based implementations using the existing static site structure.
- Keep changes consistent with the KitMetric UI style.
- Wire file inputs to conversion option controls, present supported target formats, and update the UI dynamically.
- Add or improve the before/after comparison slider after conversion completes.
- Add a download button that becomes available only when a converted image is ready.

## Use when
- editing `image-converter/*.html`
- adding or refining image converter UI logic
- tasked with making converter tool pages more complete and user-friendly
