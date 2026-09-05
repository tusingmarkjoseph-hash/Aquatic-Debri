const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const CHARACTERISTIC_UUID_RX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

let bleDevice = null;
let rxCharacteristic = null;

async function startPhoneCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
        });
        document.getElementById('camera-feed').srcObject = stream;
    } catch (err) {
        console.error("Camera error: ", err);
    }
}

async function connectBLE() {
    const statusText = document.getElementById('status');
    const connectBtn = document.getElementById('connectBtn');

    try {
        statusText.innerText = "Scanning for all nearby BLE devices...";
        
        // Pwersahang buksan ang scanner para sa LAHAT ng device nang walang filter sa pangalan
        bleDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
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

        startPhoneCamera();

    } catch (error) {
        console.error("BLE Error: ", error);
        statusText.innerText = "Error: " + error.name + " -> " + error.message;
        statusText.style.color = "red";
    }
}

async function sendCommand(command) {
    if (!rxCharacteristic) return;
    try {
        let encoder = new TextEncoder();
        await rxCharacteristic.writeValue(encoder.encode(command));
        console.log(`Sent: ${command}`);
    } catch (error) {
        console.error("Error sending: ", error);
    }
}

