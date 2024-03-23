import React, { useState } from 'react';

const Fileupload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);

      const reader = new FileReader()
      console.log(reader.readAsText(event.target.files[0]));
      reader.addEventListener('load', () => {
        // Print the result of the read operation
        console.log(reader.result);
      });
      }
    
    
  

  // Function to handle file upload
  const handleUpload = () => {
    
    // You can perform file upload logic here, like sending the file to a server
    if (selectedFile) {
      console.log('Uploading file:', selectedFile);
      // Example: You can use FormData to send the file to an API endpoint
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // Then, you can make a POST request using fetch or an HTTP client library like Axios
      // fetch('/upload', { method: 'POST', body: formData })
      //   .then(response => response.json())
      //   .then(data => console.log(data))
      //   .catch(error => console.error('Error uploading file:', error));
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <input type="file" webkitdirectory mozdirectory directory onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Fileupload;