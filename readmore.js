document.addEventListener("DOMContentLoaded", function () {
    const readMoreButtons = document.querySelectorAll(".read-more-btn");

    readMoreButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const abstract = button.previousElementSibling;
            const shortAbstract = abstract.previousElementSibling;
            
            if (abstract.style.display === "none") {
                abstract.style.display = "inline";
                shortAbstract.style.display = "none";
                button.textContent = "Read Less";
            } else {
                abstract.style.display = "none";
                shortAbstract.style.display = "inline";
                button.textContent = "Read More";
            }
        });
    });
});
