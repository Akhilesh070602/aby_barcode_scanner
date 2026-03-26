// =======================
// FETCH DATA
// =======================
function fetchData() {

    let code = document.getElementById("inputCode").value;
    if (code === "") return;

    document.querySelector("#poTable tbody").innerHTML = `
        <tr><td>101</td><td>Cotton</td><td>26-03-2026</td><td>5</td></tr>
    `;

    document.querySelector("#lineTable tbody").innerHTML = `
        <tr><td>1</td><td>A</td><td>10</td><td>Cotton</td></tr>
        <tr><td>2</td><td>B</td><td>11</td><td>Silk</td></tr>
    `;

    stdWeight.value = "12.5";
    actWeight.value = "11.9";

    confirmData();
}


// =======================
// CONFIRM
// =======================
function confirmData() {
    let std = parseFloat(stdWeight.value);
    let act = parseFloat(actWeight.value);

    if (act > std) alert("Weight mismatch ❌");
    else alert("Auto Confirmed ✅");
}


// =======================
// QR POPUP SCANNER
// =======================
let qr = null;

function openScanner() {

    document.getElementById("qrModal").style.display = "flex";

    qr = new Html5Qrcode("reader");

    function onScanSuccess(text) {
        document.getElementById("inputCode").value = text;
        fetchData();
        stopScanner();
    }

    Html5Qrcode.getCameras().then(devices => {

        if (!devices.length) {
            alert("No camera found ❌");
            return;
        }

        qr.start(devices[0].id, { fps: 10, qrbox: 250 }, onScanSuccess);

    });
}

function stopScanner() {
    if (qr) {
        qr.stop().then(() => qr.clear()).catch(() => {});
    }
    document.getElementById("qrModal").style.display = "none";
}