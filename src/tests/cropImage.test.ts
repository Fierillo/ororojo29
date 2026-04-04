import { describe, it, expect, beforeEach } from 'vitest';
import { PLACEHOLDER, getCropImageSrc, getCropImageProps, getCropBgImageStyle } from '../lib/cropImage';

describe('cropImage', () => {
  describe('PLACEHOLDER', () => {
    it('should be defined', () => {
      expect(PLACEHOLDER).toBeDefined();
    });

    it('should be a valid path', () => {
      expect(PLACEHOLDER).toBe('/images/placeholder.svg');
    });
  });

  describe('getCropImageSrc', () => {
    it('should return placeholder for null', () => {
      expect(getCropImageSrc(null)).toBe(PLACEHOLDER);
    });

    it('should return placeholder for undefined', () => {
      expect(getCropImageSrc(undefined)).toBe(PLACEHOLDER);
    });

    it('should return placeholder for empty string', () => {
      expect(getCropImageSrc('')).toBe(PLACEHOLDER);
    });

    it('should return the src when provided', () => {
      expect(getCropImageSrc('/api/images/1')).toBe('/api/images/1');
    });

    it('should return the src when provided as string', () => {
      expect(getCropImageSrc('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
    });
  });

  describe('getCropImageProps', () => {
    it('should return placeholder as src when null', () => {
      const props = getCropImageProps({ src: null, alt: 'Test' });
      expect(props.src).toBe(PLACEHOLDER);
    });

    it('should return provided src when valid', () => {
      const props = getCropImageProps({ src: '/api/images/1', alt: 'Test' });
      expect(props.src).toBe('/api/images/1');
    });

    it('should include alt text', () => {
      const props = getCropImageProps({ src: null, alt: 'Product Image' });
      expect(props.alt).toBe('Product Image');
    });

    it('should handle fill prop', () => {
      const withFill = getCropImageProps({ src: null, alt: 'Test', fill: true });
      const withoutFill = getCropImageProps({ src: null, alt: 'Test', fill: false });

      expect(withFill.fill).toBe(true);
      expect(withoutFill.fill).toBe(false);
    });

    it('should set width/height when fill is false', () => {
      const props = getCropImageProps({ src: null, alt: 'Test', width: 100, height: 200, fill: false });
      expect(props.width).toBe(100);
      expect(props.height).toBe(200);
    });

    it('should not set width/height when fill is true', () => {
      const props = getCropImageProps({ src: null, alt: 'Test', width: 100, height: 200, fill: true });
      expect(props.width).toBeUndefined();
      expect(props.height).toBeUndefined();
    });

    it('should include onError handler when withFallback is true', () => {
      const props = getCropImageProps({ src: null, alt: 'Test', withFallback: true });
      expect(props.onError).toBeDefined();
      expect(typeof props.onError).toBe('function');
    });

    it('should not include onError handler when withFallback is false', () => {
      const props = getCropImageProps({ src: null, alt: 'Test', withFallback: false });
      expect(props.onError).toBeUndefined();
    });

    it('should include className', () => {
      const props = getCropImageProps({ src: null, alt: 'Test', className: 'custom-class' });
      expect(props.className).toBe('custom-class');
    });

    it('should include sizes', () => {
      const props = getCropImageProps({ src: null, alt: 'Test', sizes: '(max-width: 768px) 100vw' });
      expect(props.sizes).toBe('(max-width: 768px) 100vw');
    });

    it('should include priority', () => {
      const props = getCropImageProps({ src: null, alt: 'Test', priority: true });
      expect(props.priority).toBe(true);
    });
  });

  describe('getCropBgImageStyle', () => {
    it('should return placeholder url for null', () => {
      expect(getCropBgImageStyle(null)).toBe(`url(${PLACEHOLDER})`);
    });

    it('should return placeholder url for undefined', () => {
      expect(getCropBgImageStyle(undefined)).toBe(`url(${PLACEHOLDER})`);
    });

    it('should return styled url with provided src', () => {
      expect(getCropBgImageStyle('/api/images/1')).toBe('url(/api/images/1)');
    });
  });
});