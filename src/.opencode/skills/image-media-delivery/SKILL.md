---
name: image-media-delivery
description: Use when a task involves images, video, or other media. Provides foundational guidance on image formats, responsive images, lazy loading, and optimization.
---

# Image and Media Delivery

## Expert stance

Apply best practices for delivering images and media on the web. Images are
often the largest assets on a page; optimizing them is critical for
performance.

## Image formats

### Raster formats

- **JPEG:** Photographs, complex images. Use quality 75-85.
- **PNG:** Images with transparency, sharp edges, text. Use sparingly (large
  file sizes).
- **WebP:** Modern format, better compression than JPEG/PNG. Use when
  supported.
- **AVIF:** Next-gen format, best compression. Use when supported.

### Vector formats

- **SVG:** Logos, icons, illustrations. Scalable, small file size.
- Optimize SVGs with SVGO.
- Inline small SVGs; externalize large ones.

### Choosing formats

- Use `<picture>` with multiple `<source>` elements for format fallbacks.
- Serve AVIF to supporting browsers, WebP as fallback, JPEG as last resort.
- Use SVG for logos and icons.

## Responsive images

- Use `srcset` and `sizes` for resolution switching.
- Use `<picture>` for art direction (different crops at different sizes).
- Provide multiple resolutions (1x, 2x) for retina displays.

```html
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  alt="Description"
/>
```

## Lazy loading

- Use `loading="lazy"` for below-the-fold images.
- Do not lazy-load above-the-fold images (hurts LCP).
- Use Intersection Observer for custom lazy loading.

## Optimization

- Compress images (TinyPNG, ImageOptim, Squoosh).
- Resize images to the maximum display size.
- Strip metadata (EXIF, color profiles) when not needed.
- Use CDN with image transformation (Cloudinary, Imgix, Cloudflare).

## Video

- Use `<video>` with multiple sources for format support.
- Provide subtitles and captions.
- Use `preload="none"` or `preload="metadata"` to defer loading.
- Consider autoplay policies (muted autoplay is allowed).

## Accessibility

- Provide meaningful `alt` text for informative images.
- Use `alt=""` for decorative images.
- Provide text alternatives for complex images (charts, diagrams).
- Ensure sufficient color contrast in images.
- Do not convey information with color alone.

## Best practices

- Measure image impact with Lighthouse or WebPageTest.
- Set explicit `width` and `height` to prevent layout shift.
- Use `aspect-ratio` CSS property for responsive containers.
- Serve images from a CDN.
- Cache images aggressively (long `Cache-Control` max-age).
