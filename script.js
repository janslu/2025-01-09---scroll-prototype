gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    const scrollItems = gsap.utils.toArray('.scroll-item');
    const container = document.querySelector('.scroll-container');

    // Set initial states
    scrollItems.forEach((item, i) => {
        gsap.set(item, { opacity: i === 0 ? 1 : 0 });
        gsap.set(item.querySelector('.caption'), {
            opacity: 0,
            y: 50
        });
    });

    // Create main timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "center center",
            end: () => `+=${(scrollItems.length) * 100 * 30}vh`,
            pin: true,
            scrub: 6,
            markers: false
        }
    });

    // Each section duration
    const sectionDuration = 15;
    const crossfadeDuration = 3;
    const captionDelay = 1;
    const captionFadeDuration = 2;

    // Add animations to timeline
    scrollItems.forEach((item, index) => {
        const isLast = index === scrollItems.length - 1;
        const nextItem = scrollItems[index + 1];
        const caption = item.querySelector('.caption');
        const startTime = index * sectionDuration;

        if (index === 0) {
            // First caption animation only
            tl.to(caption, {
                opacity: 1,
                y: 0,
                duration: captionFadeDuration,
                ease: "power2.out"
            }, startTime + captionDelay);
        } else {
            // Fade in current item (starts during previous item's fade out)
            tl.to(item, {
                opacity: 1,
                duration: crossfadeDuration
            }, startTime - crossfadeDuration);

            // Animate caption
            tl.to(caption, {
                opacity: 1,
                y: 0,
                duration: captionFadeDuration,
                ease: "power2.out"
            }, startTime + captionDelay);
        }

        if (nextItem) {
            // Fade out caption before the crossfade (only for non-last items)
            tl.to(caption, {
                opacity: 0,
                duration: captionFadeDuration
            }, startTime + sectionDuration - crossfadeDuration - captionFadeDuration);

            // Fade out current item
            tl.to(item, {
                opacity: 0,
                duration: crossfadeDuration
            }, startTime + sectionDuration - crossfadeDuration);
        } else if (isLast) {
            // For the last item, only fade out the image, keep caption visible
            tl.to(item, {
                opacity: 0,
                duration: crossfadeDuration
            }, startTime + sectionDuration + crossfadeDuration);
        }
    });
});