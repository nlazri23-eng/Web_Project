class Toast {
    show(message) {
        if ($("#toast").length === 0) {
            $("<div>").attr("id", "toast").appendTo("body");
        }

        $("#toast").text(message).addClass("show");
        setTimeout(function () {
            $("#toast").removeClass("show");
        }, 3000);
    }
}
