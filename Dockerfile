FROM public.ecr.aws/lambda/nodejs:18

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["lambda.handler"]
