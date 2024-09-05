# Reisetopia challenge

``` code
Hello! 🙌 
This is an assessment I did for reisotopia ⭐️ Enjoy. 
``` 

#### Deployed the rest-api as a lambda on aws

- Deployed on AWS lambda with apiGateway using serverless framework and docker
- DB on hosted on mongo atlas

https://pi8fwbp2e5.execute-api.us-east-1.amazonaws.com/health-check
https://pi8fwbp2e5.execute-api.us-east-1.amazonaws.com/v1/recruiting/hotels

## 🛠️ Getting Started

#### Step 1: 🚀 Initial Setup

- Clone the repository
- Navigate: `cd into repo`
- Install dependencies: `yarn install`

#### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.example` to `.env`
- Update `.env`: Fill in necessary environment variables

- Pre-populate or seed your mongo db collection(`hotels`) with the hotels.json data

#### Step 3: 🏃‍♂️ Running the Project

- Dev Server: `yarn run dev`
- Build: `yarn run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `yarn run build && yarn run start`

#### TODO: 

- Introduce swagger ui for api documentation
- Continue with unit tests for some utils and integration tests
- Fix response payload(ServiceResponse)

🎉 Thanks!
