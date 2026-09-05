// Siguraduhing tugma ang mga UUID sa iyong ESP32-CAM Code
const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const CHARACTERISTIC_UUID_RX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

let bleDevice = null;
let rxCharacteristic = null;

// 1. BUKSAN ANG PHONE CAMERA (Para sa object tracking/location isolation)
async function startPhoneCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } // Gagamitin ang likod na camera ng phone
        });
        document.getElementById('camera-feed').srcObject = stream;
    } catch (err) {
        console.error("Hindi mabuksan ang camera ng phone: ", err);
        alert("Pahintulutan ang camera access sa iyong browser setting!");
    }
}

// 2. WEB BLUETOOTH CONNECTION ENGINE
async function connectBLE() {
    const statusText = document.getElementById('status');
    const connectBtn = document.getElementById('connectBtn');

    try {
        statusText.innerText = "Searching for robot...";
        
        // Mag-request ng Bluetooth Device na kapangalan ng nasa ESP32 code
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{ name: "Aquatic_Bot" }],
            optionalServices: [SERVICE_UUID]
        });

        statusText.innerText = "Connecting to GATT Server...";
        const server = await bleDevice.gatt.connect();

        statusText.innerText = "Fetching Service...";
        const service = await server.getPrimaryService(SERVICE_UUID);

        statusText.innerText = "Fetching Characteristic...";
        rxCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID_RX);

        statusText.innerText = "Connected Successfully! 🎉";
        statusText.style.color = "green";
        connectBtn.innerText = "Connected! ✅";
        connectBtn.style.background = "#28a745";

        // Simulan ang camera ng telepono kapag konektado na ang Bluetooth
        startPhoneCamera();

    } catch (error) {
        console.error("BLE Error: ", error);
        statusText.innerText = "Connection Failed. Try again.";
        statusText.style.color = "red";
    }
}

// 3. FUNCTION PARA MAGPADALA NG UTOS SA ROBOT (Navigation & AI Trigger)
async function sendCommand(command) {
    if (!rxCharacteristic) {
        alert("Mangyaring kumonekta muna sa Bluetooth ng Robot!");
        return;
    }

    try {
        let encoder = new TextEncoder();
        // I-convert ang text gaya ng "FORWARD" o "SCAN" papuntang byte array
        await rxCharacteristic.writeValue(encoder.encode(command));
        console.log(`Sent command: ${command}`);
    } catch (error) {
        console.error("Error sending command: ", error);
    }
}
