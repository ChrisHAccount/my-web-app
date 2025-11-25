// Wait for the Document Object Model (DOM) to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const button = document.getElementById('addItemButton'); // The "Submit" button
    const input = document.getElementById('messageInput'); // The text field

    // Add click event listener to the button
    button.addEventListener('click', async () => {
        // Get the value typed by the user
        const message = input.value.trim(); // Remove extra spaces

        // Validate input
        if (!message) {
            alert("Please enter a message before submitting.");
            return; // Stop if empty
        }
        
        // Send message to server via fetch
        try {
            const response = await fetch('/add-item', {
                method: 'POST', // POST request
                headers: { 'Content-Type': 'application/json' }, // Send JSON
                body: JSON.stringify({ message }) // Wrap message in JSON
            });

            // Handle server response
            if (response.ok) {
                alert('Message added successfully!');
                input.value = ""; // Clear input after success
            } else {
                alert('Error adding message');
            }
        } catch (error) {
            console.error(error);
            alert('Error adding message');
        }
    });
});