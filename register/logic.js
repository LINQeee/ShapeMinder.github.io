
async function nexForm() {
    let accountForm = $("#accountForm");
    let biologyForm = $("#biologyForm");
    let headerSpan = $("#headerSpan");
    accountForm.css("opacity", "0");
    headerSpan.css("opacity", "0");

    await sleep(350);

    accountForm.css("display", "none");
    headerSpan.text("Расскажите О Себе")

    biologyForm.css("display", "flex");
    await sleep(50);
    biologyForm.css("opacity", "1");
    headerSpan.css("opacity", "1");
}