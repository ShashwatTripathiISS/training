# from fastapi import FastAPI, File, UploadFile
# from fastapi.responses import JSONResponse
# import boto3
# import os
# import base64
# import json
# from dotenv import load_dotenv
# # import snappy

# load_dotenv()

# app = FastAPI()

# AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
# AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
# AWS_REGION = os.getenv("AWS_REGION")
# STEP_FUNCTION_ARN = os.getenv("STEP_FUNCTION_ARN")

# step_client = boto3.client(
#     "stepfunctions",
#     aws_access_key_id=AWS_ACCESS_KEY_ID,
#     aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
#     region_name=AWS_REGION
# )

# @app.post("/upload/")
# async def upload_file(file: UploadFile = File(...)):
#     try:
#         file_content = await file.read()

#         # new code - if it doesn't work remove it ;)
#         # print(len(file_content))

#         # compressed_content = snappy.compress(file_content)
#         # double_compressed_content = snappy.compress(compressed_content)
#         # double_compressed_content = snappy.compress(double_compressed_content)
#         # double_compressed_content = snappy.compress(double_compressed_content)

#         # print(len(compressed_content))
#         # print(len(double_compressed_content))

#         # while(len(file_content) > 1024 * 1024):
#         #     # print(file_content)
#         #     compressed_content = snappy.compress(file_content)
#         #     file_content = compressed_content

#         #     print(len(file_content))

#         if(len(file_content) > 1024 * 1024):
#             return JSONResponse(content={"error": "Compressed file still exceeds Step Function input size limit."}, status_code=400)



#         input_data = {
#             "filename": file.filename,
#             "file_content": base64.b64encode(file_content).decode("utf-8")
#         }
#         response = step_client.start_execution(
#             stateMachineArn=STEP_FUNCTION_ARN,
#             input=json.dumps(input_data)
#         )
#         return JSONResponse(content={
#             "filename": file.filename,
#             "message": "Step Function started",
#             "executionArn": response["executionArn"]
#         })
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)














# from fastapi import FastAPI, File, UploadFile
# from fastapi.responses import JSONResponse
# import boto3
# import os
# import base64
# import json
# from dotenv import load_dotenv

# load_dotenv()

# app = FastAPI()

# AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
# AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
# AWS_REGION = os.getenv("AWS_REGION")
# LAMBDA_ARN = os.getenv("LAMBDA_ARN")

# lambda_client = boto3.client(
#     "lambda",
#     aws_access_key_id=AWS_ACCESS_KEY_ID,
#     aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
#     region_name=AWS_REGION
# )

# @app.post("/upload/")
# async def upload_file(file: UploadFile = File(...)):
#     try:
#         file_content = await file.read()
#         payload = {
#             "filename": file.filename,
#             "file_content": base64.b64encode(file_content).decode("utf-8")
#         }
#         response = lambda_client.invoke(
#             FunctionName=LAMBDA_ARN,
#             InvocationType="RequestResponse",
#             Payload=json.dumps(payload)
#         )
#         result = json.loads(response['Payload'].read())
#         return JSONResponse(content=result)
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)







from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
BUCKET1 = os.getenv("BUCKET1")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        s3_client.put_object(Bucket=BUCKET1, Key=file.filename, Body=file_content)
        return JSONResponse(content={
            "filename": file.filename,
            "message": f"File uploaded to S3 bucket {BUCKET1}"
        })
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)