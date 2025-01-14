gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    const scrollItems = gsap.utils.toArray('.scroll-item');
    const container = document.querySelector('.scroll-container');

    // Distance from edges where captions start and end their movement
    const verticalOffset = 32;

    // Initialize each slide and its caption
    // First slide starts visible, others are hidden
    // All captions start hidden and positioned verticalOffset pixels from bottom
    scrollItems.forEach((item, i) => {
        gsap.set(item, { opacity: i === 0 ? 1 : 0 });
        const caption = item.querySelector('.caption');
        const imageHeight = item.offsetHeight;
        gsap.set(caption, {
            opacity: 0,
            y: (imageHeight / 2) - caption.offsetHeight - verticalOffset
        });
    });

    // Main scrolling timeline
    // Pins the container and creates a scrolling animation sequence
    // Total scroll length is proportional to number of slides
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "center center",
            end: () => `+=${(scrollItems.length) * 100 * 6}vh`,
            pin: true,
            scrub: 1,
            // markers: true  // Uncomment to see ScrollTrigger markers for debugging
        }
    });

    // Animation timing constants
    const sectionDuration = 10;     // Total duration for each slide
    const crossfadeDuration = 3;    // Duration of fade in/out transitions

    // Create animations for each slide
    scrollItems.forEach((item, index) => {
        const nextItem = scrollItems[index + 1];
        const caption = item.querySelector('.caption');
        const startTime = index * sectionDuration;
        const imageHeight = item.offsetHeight;
        const nextCaption = nextItem?.querySelector('.caption');

        // Final position for caption (verticalOffset pixels from top)
        const endY = (-imageHeight / 2) + verticalOffset;

        // Animation sequence for the first slide:
        // 1. Caption fades in
        // 2. Caption moves up
        // 3. Caption and image fade out (handled in next iteration)
        if (index === 0) {
            tl.to(caption, {
                opacity: 1,
                duration: crossfadeDuration,
                ease: "power1.inOut"
            }, startTime)
            .to(caption, {
                y: endY,
                duration: sectionDuration - (2 * crossfadeDuration),
                ease: "power1.inOut"
            }, startTime + crossfadeDuration);
        }

        // Animation sequence for subsequent slides:
        // 1. Previous slide and its caption fade out
        // 2. Current slide and its caption fade in simultaneously
        // 3. Caption moves up while staying fully visible
        // 4. At the end, both fade out (handled in next iteration)
        if (nextItem) {
            // Calculate when this slide should start transitioning to the next
            const transitionTime = startTime + sectionDuration - crossfadeDuration;

            // Fade out current slide and its caption
            tl.to([item, caption], {
                opacity: 0,
                duration: crossfadeDuration,
                ease: "power1.inOut"
            }, transitionTime);

            // Simultaneously fade in next slide and its caption
            tl.to([nextItem, nextCaption], {
                opacity: 1,
                duration: crossfadeDuration,
                ease: "power1.inOut"
            }, transitionTime);

            // Move the caption up after it's fully visible
            if (nextCaption) {
                tl.to(nextCaption, {
                    y: endY,
                    duration: sectionDuration - (2 * crossfadeDuration),
                    ease: "power1.inOut"
                }, transitionTime + crossfadeDuration);
            }
        }
    });
});