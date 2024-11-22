// Function to open the modal
function openModal() {
    document.getElementById("uploadModal").style.display = "block";
}

// Function to close the modal
function closeModal() {
    document.getElementById("uploadModal").style.display = "none";
}

// Function to display file name, preview, and trigger OCR process
function displayFilePreview() {
    const fileInput = document.getElementById("fileInput");
    const fileDisplayArea = document.getElementById("fileDisplayArea");
    const filePreview = document.getElementById("filePreview");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = file.name;

        // Display file name
        fileDisplayArea.textContent = `Selected File: ${fileName}`;

        // Display image preview for image files
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="File Preview">`;
            };
            reader.readAsDataURL(file);

            // Trigger backend OCR process
            sendFileToBackend(file);
        } else {
            filePreview.innerHTML = `<p>No preview available for this file type.</p>`;
        }

        closeModal(); // Close the modal after file selection
    } else {
        fileDisplayArea.textContent = ""; // Clear display if no file is selected
        filePreview.innerHTML = ""; // Clear preview area
    }
}

// Function to send the file to the backend
function sendFileToBackend(file) {
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("OCR Output:", data);

            if (data.imagePreview) {
                const imagePreview = document.getElementById("filePreview");
                imagePreview.innerHTML = `<img src="${data.imagePreview}" alt="Processed Image Preview">`;
            }

            if (data.extractedText) {
                populateOCRTable(data.extractedText);
            }

            alert("OCR Process Completed Successfully");
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// Function to populate OCR output table
function populateOCRTable(ocrText) {
    const ocrTableBody = document.getElementById("ocrTable").querySelector("tbody");

    // Clear any existing rows
    ocrTableBody.innerHTML = "";

    // Add OCR data as a single entry (can be modified for structured data)
    const row = document.createElement("tr");
    const fieldCell = document.createElement("td");
    fieldCell.textContent = "Extracted Text";
    const textCell = document.createElement("td");
    textCell.textContent = ocrText;

    row.appendChild(fieldCell);
    row.appendChild(textCell);
    ocrTableBody.appendChild(row);
}

// Close modal if user clicks outside of it
window.onclick = function (event) {
    const modal = document.getElementById("uploadModal");
    if (event.target === modal) {
        closeModal();
    }
};
