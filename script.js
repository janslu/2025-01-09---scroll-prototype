gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    const scrollItems = gsap.utils.toArray('.scroll-item');
    const container = document.querySelector('.scroll-container');

    // Distance from edges where captions start and end their movement
    const verticalOffset = 32;

    // Initialize each slide and its texts
    scrollItems.forEach((item, i) => {
        gsap.set(item, { opacity: i === 0 ? 1 : 0 });

        const caption = item.querySelector('.caption.textbox');
        const source = item.querySelector('.source.textbox');
        const imageHeight = item.offsetHeight;

        // Calculate positions
        const startY = (imageHeight / 2) - (caption?.offsetHeight || 0) - verticalOffset;
        const endY = (-imageHeight / 2) + verticalOffset;

        // Initialize caption
        if (caption) {
            gsap.set(caption, {
                opacity: 0,
                y: startY
            });
        }

        // Initialize source (if exists) - position it at the same final position as caption
        if (source) {
            gsap.set(source, {
                opacity: 0,
                y: endY
            });
        }
    });

    // Animation timing constants
    const baseSectionDuration = 10;     // Base duration for each slide
    const crossfadeDuration = 3;        // Duration of fade in/out transitions
    const sourceDuration = 5;           // How long source text stays visible
    const pauseBeforeSource = 1;        // Duration to pause before showing source
    const lastSlideExtraDuration = 3;   // Extra time for the last slide's source

    // Calculate total timeline length considering additional time for slides with sources
    const totalDuration = scrollItems.reduce((total, item, index) => {
        const hasSource = item.querySelector('.source.textbox') !== null;
        const isLastSlide = index === scrollItems.length - 1;
        const slideDuration = hasSource ? baseSectionDuration + sourceDuration : baseSectionDuration;
        // Add extra time if it's the last slide with source
        return total + slideDuration + (isLastSlide && hasSource ? lastSlideExtraDuration : 0);
    }, 0);

    // Main scrolling timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "center center",
            end: () => `+=${totalDuration * 60}vh`,
            pin: true,
            scrub: 1,
            // markers: true
        }
    });

    // Create animations for each slide
    let currentTime = 0;  // Keep track of timeline position

    scrollItems.forEach((item, index) => {
        const isLastSlide = index === scrollItems.length - 1;
        const nextItem = scrollItems[index + 1];
        const caption = item.querySelector('.caption.textbox');
        const source = item.querySelector('.source.textbox');
        const imageHeight = item.offsetHeight;

        // Get next slide's elements
        const nextCaption = nextItem?.querySelector('.caption.textbox');
        const nextSource = nextItem?.querySelector('.source.textbox');

        // Calculate section duration based on whether it has a source
        const sectionDuration = source ?
            baseSectionDuration + sourceDuration + (isLastSlide ? lastSlideExtraDuration : 0) :
            baseSectionDuration;

        // Calculate timing segments
        const captionScrollDuration = baseSectionDuration - (2 * crossfadeDuration);
        const endY = (-imageHeight / 2) + verticalOffset;

        if (index === 0) {
            // First slide animation
            if (caption) {
                tl.to(caption, {
                    opacity: 1,
                    duration: crossfadeDuration,
                    ease: "power1.inOut"
                }, currentTime)
                .to(caption, {
                    y: endY,
                    duration: captionScrollDuration,
                    ease: "power1.inOut"
                }, currentTime + crossfadeDuration);

                if (source) {
                    const sourceStartTime = currentTime + crossfadeDuration + captionScrollDuration + pauseBeforeSource;
                    // Crossfade from caption to source after pause
                    tl.to(caption, {
                        opacity: 0,
                        duration: crossfadeDuration,
                        ease: "power1.inOut"
                    }, sourceStartTime)
                    .to(source, {
                        opacity: 1,
                        duration: crossfadeDuration,
                        ease: "power1.inOut"
                    }, sourceStartTime);
                }
            }
        }

        if (nextItem) {
            const transitionTime = currentTime + sectionDuration - crossfadeDuration;

            // Fade out current slide and its texts
            const fadeOutElements = [item];
            if (caption) fadeOutElements.push(caption);
            if (source) fadeOutElements.push(source);

            tl.to(fadeOutElements, {
                opacity: 0,
                duration: crossfadeDuration,
                ease: "power1.inOut"
            }, transitionTime);

            // Fade in next slide
            tl.to(nextItem, {
                opacity: 1,
                duration: crossfadeDuration,
                ease: "power1.inOut"
            }, transitionTime);

            // Animate next slide's caption
            if (nextCaption) {
                tl.to(nextCaption, {
                    opacity: 1,
                    duration: crossfadeDuration,
                    ease: "power1.inOut"
                }, transitionTime)
                .to(nextCaption, {
                    y: endY,
                    duration: captionScrollDuration,
                    ease: "power1.inOut"
                }, transitionTime + crossfadeDuration);

                // If next slide has source, handle caption to source crossfade
                if (nextSource) {
                    const nextSourceStartTime = transitionTime + crossfadeDuration + captionScrollDuration + pauseBeforeSource;
                    tl.to(nextCaption, {
                        opacity: 0,
                        duration: crossfadeDuration,
                        ease: "power1.inOut"
                    }, nextSourceStartTime)
                    .to(nextSource, {
                        opacity: 1,
                        duration: crossfadeDuration,
                        ease: "power1.inOut"
                    }, nextSourceStartTime);
                }
            }
        }

        // Update timeline position
        currentTime += sectionDuration;
    });
});