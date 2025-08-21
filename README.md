# training

## AWS POC

### Task 1: Create a free-tier account on AWS
Set-up keys and MFA for your account<br>
<img src="./screenshots/MFA.png" alt="MFA" width="700" height="400">

-------------
### Task 2: Launch an EC2 instance 
Generate key pairs and set it up such that only you can SSH into it<br>
1. I have generated key pairs and downloaded the .pem file.<br>
2. Now, I will open terminal in the directory where I have saved the .pem file.<br>
3. Running this command to ensure my key is not publicly viewable: `chmod 400 "ShashwatKeyPair.pem"`<br>
4. Finally the ssh command to connect to the Linux EC2 instance: `ssh -i "ShashwatKeyPair.pem" ubuntu@ec2-65-2-4-52.ap-south-1.compute.amazonaws.com`


Result:

<img src="./screenshots/ec2_instance_with_installations.png" alt="MFA" width="700" height="400">

Note: The instance also has `python3` and `docker` installed.

-------------
### Task 4: Write a REST API (using python3) to upload file to S3
<h4>Write a REST API (using python3) to upload file to S3</h4>
1. I have created a simple FastAPI application which takes any file as user input.<br>
2. Then I have configured an IAM user with policy to be able to put files in the s3 bucket.<br>
3. The uploaded file on FastAPI page gets uploaded in the S3 bucket.


Result:

File uploaded on swagger:<br>
<img src="./screenshots/file_upload.png" alt="upload" width="700" height="400">


S3 bucket shows the file:<br>
<img src="./screenshots/file_visible_s3.png" alt="File in s3" width="700" height="400">



<h4>Dockerize the API created in and deploy it on the EC2 machine</h4>


1. We have pushed the above code into a repository.


2. Then we connected to the EC2 instance using SSH.


3. We cloned our repo in that instance machine and created a .env file in our project.


4. Adding our secret passwords will make it available inside the ec2 instance for the container to use it.


5. Trying to build the docker container using `docker buildx build -t python-rest .`

``
ERROR: permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Head "http://%2Fvar%2Frun%2Fdocker.sock/_ping": dial unix /var/run/docker.sock: connect: permission denied
``


6. The error was solved after giving the user some permissions to run the `docker build` command:<br>
<img src="./screenshots/build_error_solve.png" alt="Error in build solved" width="700" height="400">


7. Now we run the build command again.<br>
<img src="./screenshots/build_successful.png" alt="build" width="700" height="400">


8. Now we run the docker container: `docker run -d -p 8081:8000 --env-file .env --name python-rest python-rest`<br>
<img src="./screenshots/running_container.png" alt="Runing the container" width="700" height="400">


9. Get the public IP of instance using: `curl http://checkip.amazonaws.com`. Using curl to test the application deployment just by looking at the landing page:<br>
<img src="./screenshots/testing_in_cli.png" alt="testing in cli" width="700" height="400">
<br>



Final Output:<br>
<img src="./screenshots/final_s3_ec2_dockerized.png" alt="Final output"  width="700" height="400">




<h4>Now deploy the REST API created on API Gateway and have a lambda function running behind the API Gateway</h4>
*****DOUBT