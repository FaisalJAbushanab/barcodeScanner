document.addEventListener('DOMContentLoaded', function() {
    const html5QrCode = new Html5Qrcode("reader");
    
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        console.log(`Code matched = ${decodedText}`, decodedResult);
        document.getElementById('result').innerText = `Detected EAN-13 code: ${decodedText}`;
        // Stop scanning once a barcode is detected
        html5QrCode.stop().then((ignore) => {
            // QR Code scanning is stopped.
        }).catch((err) => {
            console.error("Error stopping the scanner: ", err);
        });
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    // If you want to prefer the rear camera
    Html5Qrcode.getCameras().then(cameras => {
        if (cameras && cameras.length) {
            html5QrCode.start(
                { facingMode: "environment" }, 
                config, 
                qrCodeSuccessCallback
            ).catch(err => {
                console.error("Error starting the scanner: ", err);
            });
        }
    }).catch(err => {
        console.error("Error getting cameras: ", err);
    });
});
