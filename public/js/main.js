document.addEventListener("DOMContentLoaded", function() {
    const input = document.querySelector("input[type='number']");
    
    input.addEventListener("focus", function() {
        input.style.transform = "scale(1.05)";
        input.style.transition = "all 0.3s ease";
    });
    
    input.addEventListener("blur", function() {
        input.style.transform = "scale(1)";
    });
});
