from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# AWS credentials (use environment variables or IAM role in production)
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET = os.getenv("S3_BUCKET")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        s3_client.upload_fileobj(file.file, S3_BUCKET, file.filename)
        return JSONResponse(content={"filename": file.filename, "message": "File uploaded to S3 successfully!"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)