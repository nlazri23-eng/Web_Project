$(document).ready(function () {
    $(document).on("click", 'a[href="#"]', function (event) {
        event.preventDefault();
    });

    window.pharmaCareApp = new PharmaCareApp();
    window.pharmaCareApp.init();

    if (window.location.hash === "#admin") {
        openAdminPanel();
    }
});
