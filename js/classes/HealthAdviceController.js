class HealthAdviceController {
    constructor(data) {
        this.data = data;
    }

    toggleHealthMenu() {
        $("#healthMenu").toggleClass("show");
    }

    initOutsideClick() {
        $(document).on("click", function (event) {
            if (!$(event.target).closest(".dropdown").length) {
                $("#healthMenu").removeClass("show");
            }
        });
    }

    showHealthInfo(key) {
        const data = this.data[key];
        if (!data) return;

        $(".menu-left li").removeClass("active");
        if (window.event && window.event.target) {
            $(window.event.target).addClass("active");
        }

        $("#healthInfoPanel").html(`
            <h3>${data.title}</h3>
            <ul class="health-tips">
                ${data.tips.map((tip) => "<li>" + tip + "</li>").join("")}
            </ul>
            <p class="health-warning">${data.warning}</p>
        `);
    }
}
