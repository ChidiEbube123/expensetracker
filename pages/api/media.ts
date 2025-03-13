// Importing required modules
import type { NextApiRequest, NextApiResponse } from "next"; // Type definitions for API request and response
import S3 from "aws-sdk/clients/s3"; // AWS SDK S3 client for interacting with S3
import { randomUUID } from "crypto"; // To generate a unique identifier for the file name

// Creating an instance of the S3 client with necessary credentials from environment variables
const s3 = new S3({
  apiVersion: "2006-03-01", // Specifies the S3 API version
  accessKeyId: process.env.ACCESS_KEY, // AWS Access Key ID (ensure it's securely stored in environment variables)
  secretAccessKey: process.env.SECRET_KEY, // AWS Secret Access Key
  region: process.env.REGION, // AWS Region where the S3 bucket is located
  signatureVersion: "v4", // Uses version 4 signing for secure request authentication
});

// The default export function handles API requests
export default async function handler(
  req: NextApiRequest, // Incoming request object
  res: NextApiResponse // Response object
) {
  try {
    // Extract the file type from query parameters (e.g., "image/png" -> "png")
    const ex = (req.query.fileType as string).split("/")[1];

    // Generate a unique file name with the extracted extension
    const Key = `${randomUUID()}.${ex}`;

    // Define S3 parameters for the pre-signed URL
    const s3Params = {
      Bucket: process.env.BUCKET_NAME as string, // S3 bucket name from environment variables
      Key, // Unique file name for storing in S3
      Expires: 60, // The URL will expire in 60 seconds
      ContentType: `image/${ex}`, // Ensures correct content type
    };

    // Generate a signed URL for secure file upload
    const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);

    // Log the generated upload URL (for debugging purposes)
    console.log("uploadUrl", uploadUrl);

    // Respond with the signed URL and the file key
    res.status(200).json({
      uploadUrl, // The pre-signed URL to upload the file
      key: Key, // The unique file name (useful for later retrieval)
    });
  } catch (error) {
    // Error handling if something goes wrong
    console.error("Error generating signed URL:", error);

    // Return a 500 Internal Server Error response
    res.status(500).json({
      error: "Failed to generate upload URL",
    });
  }
}
