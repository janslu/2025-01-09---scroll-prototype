gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    const scrollItems = gsap.utils.toArray('.scroll-item');
    const container = document.querySelector('.scroll-container');

    // Set initial states
    scrollItems.forEach((item, i) => {
        gsap.set(item, { opacity: i === 0 ? 1 : 0 });
        gsap.set(item.querySelector('.caption'), { opacity: 0 });
    });

    // Create main timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "center center",
            end: () => `+=${(scrollItems.length - 1) * 100 * 10}vh`,
            pin: true,
            scrub: 2,
            markers: false // For debugging
        }
    });

    // Add animations to timeline
    scrollItems.forEach((item, index) => {
        const nextItem = scrollItems[index + 1];
        const caption = item.querySelector('.caption');

        if (index === 0) {
            tl.to(caption, { opacity: 1, duration: 1 }, 0);
        } else {
            // Fade in current item and its caption
            tl.to(item, { opacity: 1, duration: 3.75 }, index);
            tl.to(caption, { opacity: 1, duration: 1 }, index + 1);
        }

        if (nextItem) {
            // Fade out current item and its caption
            tl.to(caption, { opacity: 0, duration: 1 }, index + 1.5);
            tl.to(item, { opacity: 0, duration: 3.75 }, index + 1.5);
        }
    });
});