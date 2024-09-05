FROM public.ecr.aws/lambda/nodejs:16

RUN npm install -g yarn

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["lambda.handler"]
