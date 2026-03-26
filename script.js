let qr = null;
let cameras = [];
let currentCameraIndex = 0;

// Safe stop
function safeStopScanner() {
    if (qr && qr.getState && qr.getState() === 2) {
        return qr.stop().then(() => qr.clear()).catch(() => {});
    }
    return Promise.resolve();
}

// Open scanner
function openScanner() {

    document.getElementById("qrModal").style.display = "flex";

    Html5Qrcode.getCameras().then(devices => {

        cameras = devices;

        let backIndex = devices.findIndex(cam =>
            cam.label.toLowerCase().includes("back")
        );

        currentCameraIndex = backIndex !== -1 ? backIndex : 0;

        startCamera();
    });
}

// Fast camera
function startCamera() {

    safeStopScanner().then(() => {

        qr = new Html5Qrcode("reader", {
            formatsToSupport: [
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8
            ]
        });

        let cameraId = cameras[currentCameraIndex].id;

        qr.start(
            cameraId,
            {
                fps: 15,
                qrbox: { width: 200, height: 200 }
            },
            (text) => {

                document.getElementById("inputCode").value = text;

                document.querySelector("#poTable tbody").innerHTML = `
                    <tr><td>${text}</td><td>Cotton</td><td>26-03-2026</td><td>5</td></tr>
                `;

                document.querySelector("#lineTable tbody").innerHTML = `
                    <tr><td>1</td><td>Item A</td><td>10.5</td><td>Cotton</td></tr>
                    <tr><td>2</td><td>Item B</td><td>11.2</td><td>Silk</td></tr>
                `;

                // 🔥 KEEP BLANK
                stdWeight.value = "";
                actWeight.value = "";

                stopScanner();
            }
        );
    });
}

// Flip camera
function switchCamera() {
    currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
    startCamera();
}

// Stop
function stopScanner() {
    safeStopScanner().then(() => {
        document.getElementById("qrModal").style.display = "none";
    });
}

// Close
function cancelScanner() {
    stopScanner();
}

// Confirm
function confirmData() {

    let std = parseFloat(stdWeight.value);
    let act = parseFloat(actWeight.value);

    if (isNaN(std) || isNaN(act)) {
        alert("Enter valid weights ❌");
        return;
    }

    if (act > std) {
        alert("Weight mismatch ❌");
    } else {
        alert("Confirmed ✅");
    }
}