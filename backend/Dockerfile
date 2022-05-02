# start by pulling the python image
FROM python:3.8-alpine

# copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt

# switch working directory
WORKDIR /app

# install the dependencies and packages in the requirements file
RUN apk add mariadb-dev build-base
RUN pip install -r requirements.txt

# copy every content from the local file to the image
COPY . /app

RUN apk add wget bash

RUN wget https://github.com/stripe/stripe-cli/releases/download/v1.8.7/stripe_1.8.7_linux_x86_64.tar.gz
RUN tar -xvf stripe_1.8.7_linux_x86_64.tar.gz
RUN mv ./stripe /usr/local/bin/stripe

RUN stripe login --api-key sk_test_51KLWJVKyPdTxxYmHvxC7eClx0BOrw9BmEiLxiQxKQwO2W1pGigCofwdYRnjcdccNGODtmxUhq13HPgfnUTBfNakf00ysceqLkE

# configure the container to run in an executed manner

CMD ["python", "backend.py" ]