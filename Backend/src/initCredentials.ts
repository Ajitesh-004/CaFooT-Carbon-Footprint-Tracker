import fs from 'fs';
import path from 'path';

// Check if the JSON credentials are provided as an environment variable
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // Define a writable path. The '/tmp' directory is commonly writable in production environments like Render.
  const credentialsPath = path.join('/tmp', 'google-credentials.json');

  // Write the JSON content to the file
  fs.writeFileSync(credentialsPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON, { encoding: 'utf8' });

  // Set the standard environment variable to point to the newly written file
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

  console.log('Google credentials written to:', credentialsPath);
}
