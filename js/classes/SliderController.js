class SliderController {
    initSlider() {
        let slideIndex = 0;
        const $slides = $(".slide");

        if ($slides.length === 0) return;

        setInterval(function () {
            $slides.removeClass("active");
            slideIndex = (slideIndex + 1) % $slides.length;
            $slides.eq(slideIndex).addClass("active");
        }, 3000);
    }
}
