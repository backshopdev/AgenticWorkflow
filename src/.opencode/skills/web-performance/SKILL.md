---
name: web-performance
description: Use when a task involves web performance. Provides foundational guidance on Core Web Vitals, loading performance, runtime performance, and measurement.
---

# Web Performance

## Expert stance

Apply web performance best practices. Performance is a feature; slow pages lose
users, revenue, and search ranking. Measure first, optimize second.

## Core Web Vitals

Google's Core Web Vitals measure user experience:

- **LCP (Largest Contentful Paint):** Time until the largest content element is
  visible. Target: < 2.5s.
- **INP (Interaction to Next Paint):** Responsiveness to user input. Target:
  < 200ms.
- **CLS (Cumulative Layout Shift):** Visual stability. Target: < 0.1.

## Loading performance

### Reduce payload

- Minify HTML, CSS, JavaScript.
- Compress with Brotli or Gzip.
- Tree-shake unused code.
- Code-split by route or feature.
- Remove unused CSS (PurgeCSS, UnCSS).

### Optimize resources

- Compress and resize images.
- Use modern image formats (WebP, AVIF).
- Preload critical resources (`<link rel="preload">`).
- Prefetch likely-needed resources (`<link rel="prefetch">`).
- Preconnect to required origins (`<link rel="preconnect">`).

### Optimize rendering

- Inline critical CSS.
- Defer non-critical JavaScript (`defer` or `async`).
- Use `font-display: swap` for web fonts.
- Avoid render-blocking resources.

## Runtime performance

### JavaScript

- Avoid long tasks (> 50ms); break into chunks.
- Use `requestIdleCallback` for non-urgent work.
- Use web workers for CPU-intensive tasks.
- Debounce and throttle frequent events.
- Avoid layout thrashing (batch reads and writes).

### CSS

- Use `will-change` sparingly for animations.
- Use `transform` and `opacity` for animations (GPU-accelerated).
- Avoid animating `width`, `height`, `top`, `left`.
- Use `contain` to limit layout recalculation.

### Images and media

- Lazy-load below-the-fold images.
- Use responsive images.
- Set explicit dimensions to prevent layout shift.

## Measurement

### Lab tools

- **Lighthouse:** Audit performance, accessibility, SEO.
- **WebPageTest:** Detailed waterfall and filmstrip.
- **Chrome DevTools:** Performance panel, Lighthouse.

### Field tools

- **Chrome User Experience Report (CrUX):** Real user metrics.
- **Web Vitals library:** Measure CWV in production.
- **Analytics:** Track performance metrics over time.

## Best practices

- Set performance budgets (e.g., < 200KB JS, < 100KB CSS).
- Monitor performance in CI (Lighthouse CI).
- Test on real devices and slow networks.
- Optimize for the 90th percentile, not the average.
- Performance is ongoing; measure regularly.
