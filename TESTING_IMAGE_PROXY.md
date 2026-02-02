# XBackBone Image Proxy - Testing Guide

This document provides instructions for manually testing the XBackBone image proxy implementation.

## Quick Test Commands

### Test Proxy with XBackBone Image

```bash
# Test basic proxy functionality
curl -I "http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fxbackbone.madeira.eco%2FJijO8%2FfOSebOBa51.jpeg"

# Should return:
# HTTP/1.1 200 OK
# content-type: image/jpeg
# cache-control: public, max-age=3600, immutable
```

### Test Error Handling

```bash
# Missing URL parameter
curl "http://localhost:3000/api/proxy-image"
# Expected: {"error":"Missing 'url' query parameter"}

# Wrong domain
curl "http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fexample.com%2Fimage.jpg"
# Expected: {"error":"Image must be hosted on xbackbone.madeira.eco"}

# Invalid file type
curl "http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fxbackbone.madeira.eco%2Ffile.txt"
# Expected: {"error":"Unsupported image format"}
```

### Test Image Conversion Utility

```bash
# XBackBone URL should be converted
node -e "
const url = 'https://xbackbone.madeira.eco/JijO8/fOSebOBa51.jpeg';
const encoded = encodeURIComponent(url);
console.log('Proxy URL:', '/api/proxy-image?url=' + encoded);
"

# Non-XBackBone URLs should not be converted
node -e "
const url = 'https://s3.fr-par.scw.cloud/bucket/image.jpg';
console.log('Original URL (unchanged):', url);
"
```

## Browser Testing

### 1. Test Prestation Page

1. Navigate to `http://localhost:3000/client/service`
2. Open DevTools (F12) → Network tab
3. Refresh the page
4. Look for API calls to `/api/prestation`
5. Check that image URLs in the response are proxy URLs:
   - Original: `https://xbackbone.madeira.eco/...`
   - Converted: `/api/proxy-image?url=https%3A%2F%2Fxbackbone.madeira.eco%2F...`
6. Click on an image to open the ImageSlider
7. Verify images load correctly (no console errors)

### 2. Test Portfolio Page

1. Navigate to `http://localhost:3000/client/realisations`
2. Open DevTools → Network tab
3. Look for API calls to `/api/portfolio`
4. Verify main images are proxied
5. Check that the slider displays images correctly

### 3. Test Image Slider Component

1. Navigate to any page with images (Prestation or Portfolio)
2. Click on an image to open the ImageSlider modal
3. Verify all images load correctly
4. Test navigation (next/previous buttons)
5. Test swipe on mobile (if applicable)

### 4. Test New Image Upload

1. Navigate to admin page (e.g., `/admin/prestation/create`)
2. Upload a new image to XBackBone
3. Verify the image is saved with a proxied URL
4. Check that the image displays correctly on the client page

## Automated Tests

Run the automated test suite:

```bash
npm run test:proxy
# or
node scripts/test-image-proxy.js
```

Expected output:

```
✅ Proxy Endpoint Exists
✅ Valid XBackBone Image Proxy
✅ Missing URL Parameter Error
✅ Wrong Domain Rejection
✅ Invalid Extension Rejection
✅ Cache Headers Present

📊 Results: 6 passed, 0 failed
```

## Performance Testing

### Cache Verification

```bash
# First request (should be slower - fetches from XBackBone)
time curl -o /dev/null "http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fxbackbone.madeira.eco%2FJijO8%2FfOSebOBa51.jpeg"

# Second request (should be faster - served from cache)
time curl -o /dev/null "http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fxbackbone.madeira.eco%2FJijO8%2FfOSebOBa51.jpeg"
```

### Cache Headers Check

```bash
# Check cache headers
curl -I "http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fxbackbone.madeira.eco%2FJijO8%2FfOSebOBa51.jpeg" | grep -i cache
```

Expected: `Cache-Control: public, max-age=3600, immutable`

## Troubleshooting

### Issue: Images not loading

1. Check proxy is running: `curl -I "http://localhost:3000/api/proxy-image?url=https%3A%2F%2Fxbackbone.madeira.eco%2Ftest.jpg"`
2. Verify XBackBone server is accessible: `curl -I "https://xbackbone.madeira.eco/test.jpg"`
3. Check console for errors
4. Verify environment variables are set: `grep XBACKBONE .env`

### Issue: CORS errors

- The proxy doesn't require CORS configuration since it's same-origin

### Issue: Images show as broken

1. Check the image URL is being proxied correctly
2. Verify the original XBackBone URL works directly
3. Check that the image is publicly accessible on XBackBone

## Environment Variables

| Variable                   | Default  | Description                        |
| -------------------------- | -------- | ---------------------------------- |
| `IMAGE_PROXY_CACHE_TTL`    | 3600     | Cache duration in seconds (1 hour) |
| `IMAGE_PROXY_MAX_SIZE`     | 10485760 | Max image size in bytes (10MB)     |
| `IMAGE_PROXY_LOG_REQUESTS` | true     | Enable request logging             |

## Files Modified

- `src/app/api/proxy-image/route.ts` - Proxy API endpoint
- `src/lib/image-proxy.ts` - URL conversion utility
- `src/components/ImageSlider.tsx` - Image slider component
- `src/components/PrestationList.tsx` - Prestation list component
- `src/components/sliderPortofolio.tsx` - Portfolio slider component
- `src/app/api/prestation/route.ts` - Prestation API
- `src/app/api/prestation/[id]/route.ts` - Individual prestation API
- `src/app/api/portfolio/route.ts` - Portfolio API
- `src/app/api/portfolio/[id]/route.ts` - Individual portfolio API
