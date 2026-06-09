import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

export const R2_BUCKET = process.env.R2_BUCKET!
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<string> {
  await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: contentType }))
  return `${R2_PUBLIC_URL}/${key}`
}

export async function deleteFromR2(key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }))
}
