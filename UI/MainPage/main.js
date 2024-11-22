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
            reader.onload = function(e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="File Preview">`;
            };
            reader.readAsDataURL(file);
            sendFileToBackend(file)

            // Trigger mock OCR process and populate table
            populateOCRTable();
        } else {
            filePreview.innerHTML = `<p>No preview available for this file type.</p>`;
        }

        closeModal(); // Close the modal after file selection
    } else {
        fileDisplayArea.textContent = ""; // Clear display if no file is selected
        filePreview.innerHTML = ""; // Clear preview area
    }
}

// Mock function to populate OCR output table
function populateOCRTable() {
    const ocrTableBody = document.getElementById("ocrTable").querySelector("tbody");

    // Clear any existing rows
    ocrTableBody.innerHTML = "";

    // Sample OCR data
    const ocrData = [
        { field: "Item Description 1", text: "Description 1, Quantity: 4, Price: $0, Tax: 0%" },
        { field: "Item Description 2", text: "Description 2, Quantity: 4, Price: $0, Tax: 0%" },
        { field: "Item Description 3", text: "Description 3, Quantity: 4, Price: $0, Tax: 0%" },
        { field: "Item Description 4", text: "Description 4, Quantity: 4, Price: $0, Tax: 0%" },
        { field: "Item Description 5", text: "Description 5, Quantity: 4, Price: $0, Tax: 0%" },
        { field: "Item Description 6", text: "Description 6, Quantity: 4, Price: $0, Tax: 0%" }
    ];

    // Populate table with OCR data
    ocrData.forEach(data => {
        const row = document.createElement("tr");
        const fieldCell = document.createElement("td");
        fieldCell.textContent = data.field;
        const textCell = document.createElement("td");
        textCell.textContent = data.text;

        row.appendChild(fieldCell);
        row.appendChild(textCell);
        ocrTableBody.appendChild(row);
    });
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById("uploadModal");
    if (event.target === modal) {
        closeModal();
    }
}

function sendFileToBackend(file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('OCR Output:', data);
            alert("OCR Process Completed Successfully");

            // Display image preview if available
            if (data.imagePreview) {
                const imagePreview = document.getElementById('filePreview');
                imagePreview.src = data.imagePreview;  // Set the image preview source
                imagePreview.style.display = 'block';  // Make sure it's visible
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        sendFileToBackend(file);
    }
});
