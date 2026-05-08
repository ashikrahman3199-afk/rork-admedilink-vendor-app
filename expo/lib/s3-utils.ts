import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, AWS_CONFIG } from "./aws-config";

export const uploadImageToS3 = async (uri: string): Promise<string> => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const filename = `public/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

        const command = new PutObjectCommand({
            Bucket: AWS_CONFIG.BUCKET,
            Key: filename,
            Body: buffer,
            ContentType: "image/jpeg",
            // ACL: "public-read", // Assuming bucket policy allows public read or ACLs are enabled
        });

        await s3Client.send(command);

        // Construct public URL (Standard S3 URL format)
        // https://<bucket-name>.s3.<region>.amazonaws.com/<key>
        const publicUrl = `https://${AWS_CONFIG.BUCKET}.s3.us-east-1.amazonaws.com/${filename}`;

        return publicUrl;
    } catch (error) {
        console.error("Error uploading image to S3:", error);
        throw error;
    }
};
