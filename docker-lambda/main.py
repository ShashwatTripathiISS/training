# import boto3
# import os
# import pandas as pd
# import io

# def lambda_handler(event, context):
    
#     print("Lambda handler started.")
#     s3 = boto3.client('s3')
#     bucket2 = os.environ['BUCKET2']
#     print(f"Output bucket (BUCKET2): {bucket2}")

#     print("Received event:")
#     print(event)
#     record = event['Records'][0]
#     bucket1 = record['s3']['bucket']['name']
#     filename = record['s3']['object']['key']
#     print(f"Input bucket: {bucket1}")
#     print(f"Filename: {filename}")
    
#     print("Downloading file from S3...")
#     response = s3.get_object(Bucket=bucket1, Key=filename)
#     content = response['Body'].read()
#     print("File downloaded.")

#     print("Reading CSV into pandas DataFrame...")
#     df = pd.read_csv(io.StringIO(content.decode('utf-8')))
#     print("CSV loaded.")

#     print("Renaming 'Direction' column to 'Category'...")
#     df = df.rename(columns={"Direction": "Category"})

#     print("Filtering for 'Imports' and 'Exports' in 'Category'...")
#     df = df[df["Category"].isin(["Imports", "Exports"])]

#     print("Converting 'Current_Match' to datetime and sorting...")
#     df["Current_Match"] = pd.to_datetime(df["Current_Match"], format='%d/%m/%Y')
#     df = df.sort_values("Current_Match")
    
#     print("Aggregating SUM Trade Value by Country...")
#     df['Sum_Trade_Value_By_Country'] = df.groupby("Country")["Value"].transform('sum')
#     print(df[['Country', 'Sum_Trade_Value_By_Country']].drop_duplicates())

#     print("Aggregating AVG Trade Value by Commodity...")
#     df['Avg_Trade_Value_By_Commodity'] = df.groupby("Commodity")["Value"].transform('mean')
#     print(df[['Commodity', 'Avg_Trade_Value_By_Commodity']].drop_duplicates())

#     print("Saving processed DataFrame to CSV...")
#     processed_content = df.to_csv(index=False).encode('utf-8')
#     filename_out = filename.replace(".csv", "") + "_output.csv"
#     print(f"Uploading processed file to S3: {filename_out}")
#     s3.put_object(Bucket=bucket2, Key=filename_out, Body=processed_content)
#     print("Upload complete.")

#     return {
#         "statusCode": 200,
#         "body": f"File {filename} processed and saved to {bucket2} as {filename_out}"
#     }




import boto3
import os
import pandas as pd
import io

def main():
    print("ECS container started.")
    s3 = boto3.client('s3')
    bucket1 = os.environ['S3_BUCKET']         # Input bucket from ECS environment variable
    bucket2 = os.environ['BUCKET2']           # Output bucket from ECS environment variable
    filename = os.environ['INPUT_KEY']        # Input file key from ECS environment variable

    print(f"Input bucket: {bucket1}")
    print(f"Output bucket: {bucket2}")
    print(f"Filename: {filename}")

    print("Downloading file from S3...")
    response = s3.get_object(Bucket=bucket1, Key=filename)
    content = response['Body'].read()
    print("File downloaded.")

    print("Reading CSV into pandas DataFrame...")
    df = pd.read_csv(io.StringIO(content.decode('utf-8')))
    print("CSV loaded.")

    print("Renaming 'Direction' column to 'Category'...")
    df = df.rename(columns={"Direction": "Category"})

    print("Filtering for 'Imports' and 'Exports' in 'Category'...")
    df = df[df["Category"].isin(["Imports", "Exports"])]

    print("Converting 'Current_Match' to datetime and sorting...")
    df["Current_Match"] = pd.to_datetime(df["Current_Match"], format='%d/%m/%Y')
    df = df.sort_values("Current_Match")
    
    print("Aggregating SUM Trade Value by Country...")
    df['Sum_Trade_Value_By_Country'] = df.groupby("Country")["Value"].transform('sum')
    print(df[['Country', 'Sum_Trade_Value_By_Country']].drop_duplicates())

    print("Aggregating AVG Trade Value by Commodity...")
    df['Avg_Trade_Value_By_Commodity'] = df.groupby("Commodity")["Value"].transform('mean')
    print(df[['Commodity', 'Avg_Trade_Value_By_Commodity']].drop_duplicates())

    print("Saving processed DataFrame to CSV...")
    processed_content = df.to_csv(index=False).encode('utf-8')
    filename_out = filename.replace(".csv", "") + "_output.csv"
    print(f"Uploading processed file to S3: {filename_out}")
    s3.put_object(Bucket=bucket2, Key=filename_out, Body=processed_content)
    print("Upload complete.")

if __name__ == "__main__":
    main()
    