// TIYAKING MALIIT NA TITIK (LOWERCASE) LAHAT NG LETTER!
const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const CHARACTERISTIC_UUID_RX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

let bleDevice = null;
let rxCharacteristic = null;

async function connectBLE() {
    const statusText = document.getElementById('status');
    const connectBtn = document.getElementById('connectBtn');

    try {
        statusText.innerText = "Scanning for nearby devices...";
        
        // --- ANG "ACCEPT ALL" FIX ---
        // Sinasabi nito sa Chrome na ipakita ang LAHAT ng Bluetooth devices sa paligid.
        // Hindi na ito magiging mapili sa pangalan, kaya siguradong lalabas ang robot mo.
        bleDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [SERVICE_UUID] // Kailangan pa rin ito para ma-access ang RX characteristic
        });

        statusText.innerText = "Connecting to GATT Server...";
        const server = await bleDevice.gatt.connect();
        // ... (panatilihin ang natitirang code ng iyong app.js sa ibaba)

        statusText.innerText = "Fetching Service...";
        const service = await server.getPrimaryService(SERVICE_UUID);

        statusText.innerText = "Fetching Characteristic...";
        rxCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID_RX);

        statusText.innerText = "Connected Successfully! 🎉";
        statusText.style.color = "green";
        connectBtn.innerText = "Connected! ✅";
        connectBtn.style.background = "#28a745";

        startPhoneCamera();

    } catch (error) {
        console.error("BLE Error: ", error);
        statusText.innerText = "Error: " + error.name + " -> " + error.message;
        statusText.style.color = "red";
    }
}

