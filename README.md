# Smooth Scroll Image Gallery

A smooth scrolling image gallery with caption animations using GSAP ScrollTrigger. Images crossfade seamlessly as you scroll through the page, with captions fading in and out at specific positions.

## Features

- Smooth image crossfades on scroll
- Animated captions with different positions (top-left, top-right, bottom-left, bottom-right)
- Responsive design
- Works within regular content flow
- Uses GSAP ScrollTrigger for smooth animations

## Setup

1. Clone this repository
2. Open `index.html` in your browser
3. Or serve it using a local server (e.g., using Live Server in VS Code)

## Dependencies

- GSAP (loaded via CDN)
- ScrollTrigger plugin (loaded via CDN)

## Usage

The gallery is structured with a container and individual scroll items:

```html
<div class="scroll-container">
    <div class="scroll-item" data-caption-position="top-left">
        <div class="image-container">
            <img src="your-image.jpg" alt="Description" />
            <p class="caption">Your caption text</p>
        </div>
    </div>
    <!-- Add more scroll-items as needed -->
</div>
```

Caption positions can be set using the `data-caption-position` attribute:
- `top-left`
- `top-right`
- `bottom-left`
- `bottom-right`

## License

MIT