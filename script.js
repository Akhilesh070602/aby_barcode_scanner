// =======================
// FETCH DATA
// =======================
function fetchData() {

    let code = document.getElementById("inputCode").value;

    if (code === "") {
        alert("Enter or scan barcode");
        return;
    }

    parseBarcodeData(code);
}


// =======================
// CONFIRM
// =======================
function confirmData() {

    let std = parseFloat(stdWeight.value);
    let act = parseFloat(actWeight.value);

    if (act > std) alert("Weight mismatch ❌");
    else alert("Confirmed ✅");
}


// =======================
// PARSE BARCODE DATA
// =======================
function parseBarcodeData(text) {

    try {

        let parts = text.split("|");

        if (parts.length < 5) {
            alert("Invalid barcode format ❌");
            return;
        }

        let poNo = parts[0];
        let material = parts[1];
        let date = parts[2];
        let cone = parts[3];

        document.getElementById("inputCode").value = poNo;

        document.querySelector("#poTable tbody").innerHTML = `
            <tr>
                <td>${poNo}</td>
                <td>${material}</td>
                <td>${date}</td>
                <td>${cone}</td>
            </tr>
        `;

        let lineItems = parts[4].split(";");

        let lineTable = document.querySelector("#lineTable tbody");
        lineTable.innerHTML = "";

        lineItems.forEach((item, index) => {

            let values = item.split(",");

            lineTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${values[0]}</td>
                    <td>${values[1]}</td>
                    <td>${values[2]}</td>
                </tr>
            `;
        });

        stdWeight.value = "12.5";
        actWeight.value = "11.9";

        confirmData();

    } catch (err) {
        alert("Error reading barcode ❌");
        console.log(err);
    }
}


// =======================
// CAMERA + SCANNER
// =======================
let qr = null;
let cameras = [];
let currentCameraIndex = 0;

function openScanner() {

    document.getElementById("qrModal").style.display = "flex";

    Html5Qrcode.getCameras().then(devices => {

        if (!devices.length) {
            alert("No camera found ❌");
            return;
        }

        cameras = devices;
        currentCameraIndex = 0;

        startCamera();

    });
}


function startCamera() {

    if (qr) {
        qr.stop().then(() => qr.clear()).catch(() => {});
    }

    qr = new Html5Qrcode("reader", {
        formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8
        ]
    });

    let cameraId = cameras[currentCameraIndex].id;

    function onScanSuccess(text) {
        parseBarcodeData(text);
        stopScanner();
    }

    qr.start(cameraId, { fps: 10, qrbox: 250 }, onScanSuccess);
}


// 🔄 Switch camera
function switchCamera() {

    if (!cameras.length) return;

    currentCameraIndex = (currentCameraIndex + 1) % cameras.length;

    startCamera();
}


// Stop camera
function stopScanner() {

    if (qr) {
        qr.stop().then(() => qr.clear()).catch(() => {});
    }

    document.getElementById("qrModal").style.display = "none";
}