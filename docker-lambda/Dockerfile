FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt


# Copy your Python code
COPY main.py .

# Set the entrypoint (change main.py to your filename if needed)
CMD ["python", "main.py"]