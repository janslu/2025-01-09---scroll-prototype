gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    const scrollItems = gsap.utils.toArray('.scroll-item');
    const container = document.querySelector('.scroll-container');

    // Set initial states
    scrollItems.forEach((item, i) => {
        gsap.set(item, { opacity: i === 0 ? 1 : 0 });
        const caption = item.querySelector('.caption');
        const imageHalfHeight = item.offsetHeight / 2;
        gsap.set(caption, {
            opacity: 0,
            y: imageHalfHeight  // Start at bottom of centered image
        });
    });

    // Create main timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "center center",
            end: () => `+=${(scrollItems.length) * 100 * 8}vh`,
            pin: true,
            scrub: 1,
            // markers: true
        }
    });

    // Each section duration and timing
    const sectionDuration = 10;
    const crossfadeDuration = 3;

    // Add animations to timeline
    scrollItems.forEach((item, index) => {
        const nextItem = scrollItems[index + 1];
        const caption = item.querySelector('.caption');
        const startTime = index * sectionDuration;
        const imageHalfHeight = item.offsetHeight / 2;
        const captionHeight = caption.offsetHeight / 2; // Half of caption height to account for transform

        // Calculate positions relative to center
        const startY = imageHalfHeight;  // Bottom of centered image
        const endY = -imageHalfHeight + captionHeight;   // Top of centered image, adjusted for caption center point

        // Create a timeline for this caption's movement and fades
        const captionTl = gsap.timeline();

        // Movement from bottom to top
        captionTl.fromTo(caption,
            { y: startY, opacity: 0 },
            {
                y: endY,
                duration: sectionDuration - crossfadeDuration,
                ease: "none"
            }
        );

        // Fade in at bottom (starting a bit later)
        captionTl.to(caption, {
            opacity: 1,
            duration: sectionDuration * 0.1,
            ease: "none"
        }, sectionDuration * 0.10);  // Start fade in after 5% of the duration

        // Fade out at top (only when reaching the top position)
        captionTl.to(caption, {
            opacity: 0,
            duration: crossfadeDuration,
            ease: "none"
        }, sectionDuration - crossfadeDuration);

        // Add caption timeline to main timeline
        tl.add(captionTl, startTime);

        // Image crossfade - synchronized with caption fade out
        if (nextItem) {
            tl.to(item, {
                opacity: 0,
                duration: crossfadeDuration
            }, startTime + sectionDuration - crossfadeDuration)
            .to(nextItem, {
                opacity: 1,
                duration: crossfadeDuration
            }, startTime + sectionDuration - crossfadeDuration);
        }
    });
});