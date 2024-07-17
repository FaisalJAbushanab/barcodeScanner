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

        // Make GET request with the barcode
        fetch(`https://us-central1-celiacers-app.cloudfunctions.net/product?barcode=${decodedText}`)
            .then(response => JSON.parse(response.text()))
            .then(data => {
                console.log("Response from API:", data.results[0].brandName);
                // You can process and store the response data as needed
                document.getElementById('result').innerText += `\nProduct Name: ${data.results[0].brandName}  \n Ingredients: ${data.results[0].ingredientsAr}`;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                document.getElementById('result').innerText += `\nError: ${error}`;
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
