// Siguraduhing tugma ang SERVICE UUID sa iyong ESP32-CAM Code
const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const CHARACTERISTIC_UUID_RX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

let bleDevice = null;
let rxCharacteristic = null;

async function connectBLE() {
    const statusText = document.getElementById('status');
    const connectBtn = document.getElementById('connectBtn');

    try {
        statusText.innerText = "Scanning for robot...";
        
        // --- ANG CRITICAL FIX ---
        // Sinasabi natin sa Web Browser na hanapin ang pangalang "Aquatic_Bot"
        // AT binibigyan natin ng permiso na i-access ang Service UUID ng robot natin.
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{ name: "Aquatic_Bot" }],
            optionalServices: [SERVICE_UUID] // KUNG WALA ITO, HINDI IPAPAKITA NG CHROME ANG ROBOT MO!
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

        // Simulan ang camera ng telepono pagkatapos ng BLE connection
        startPhoneCamera();

      } catch (error) {
        console.error("BLE Error: ", error);
        // IPAPAKITA NITO KUNG ANONG STRICT SECURITY LOCK ANG HUMAHARANG
        const statusText = document.getElementById('status');
        statusText.innerText = "Error: " + error.name + " -> " + error.message;
        statusText.style.color = "red";
    }
}
