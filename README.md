# Messenger API
## INSTRUCTIONS ON HOW TO RUN THIS PROJECT

* Install all the dependencies by running
```
npm install
```
* To set up the project on your local machine, you need to connect the app to use MongoDB Atlas, the cloud version of MongoDB. Create an account [here](https://www.mongodb.com/). Create a cluster and copy the connection uri in order to connect with your cluster from within your local environment. More details an be found [here](https://www.mongodb.com/docs/drivers/

* Create a .env file and create an environment variable for the MongoDB uri copied from the previous step. See example:
```
PORT=5000
MONGO_URI="mongodb+srv://{MongoDB_username}:{MongoDB_password}@cluster0.rq17ti2.mongodb.net/{database_name}?retryWrites=true&w=majority"
JWT_SECRET="{jwt_secret_token}"
```

* We can now run the project with:
```
npm run start
```

## API ENDPOINTS
/api/v1/customers/signup - Signs up a customer user
/api/v1/customers/login - Logs in a customer user

/api/v1/riders/signup - Signs up a rider user
/api/v1/riders/login - Logs in a rider user

/api/v1/customers/signup - Signs up a customer user

/api/v1/orders/accept/:orderId - For a rider to accept an order by orderId (Requires a rider user. This endpoint is secured such that a customer user is not authorized to call this endpoint)

/api/v1/orders/fetch_all - For a rider to fetch all orders (Requires a rider user. This endpoint is secured such that a customer user is not authorized to call this endpoint)

/api/v1/orders/get_order/:orderId - For a rider to get an order by orderId (Requires a rider user. This endpoint is secured such that a customer user is not authorized to call this endpoint. Another suggestion for this type of authentication is included in the description of the thirdPartyAuthMiddleware.ts file)

/api/v1/logistics/orders - Get all orders that is assigned to a logistics company (Requires a third party user. This endpoint is secured such that a customer user and a rider user are not authorized to call this endpoint)

/api/v1/logistics/orders/:orderId - Get an order that is assigned to a logistics company by an orderId (Requires a third party user. This endpoint is secured such that a customer user and a rider user are not authorized to call this endpoint)

/api/v1/logistics/orders?status - Get all orders that is assigned to a logistics company by order status (Requires a third party user. This endpoint is secured such that a customer user and a rider user are not authorized to call this endpoint)

## Design Decisions and Tradeoffs
Designing this api, I decided to create 3 types of users; Customers, Riders and ThirdParty users. A customer can sign up, login and create a user. While Riders can sign up, log in, update order status, accept orders and fetch orders.

JWT was used for the authentication and authorization mechanism. Before processing any request, we try to validate the request token which will be passed with the request to verify the type of user initiating this request. This will allow us protect the endpoints and expose endpoints to authorized users only.

After creating an order, we append the new order to the list of orders property of the Customer and update the latest order attribute to the new order. This will enable us track the lastest order created by a customer.

Since every order is assigned to a Rider, a Rider can update an order. For a Rider to update the status of an order, the rider must be assigned to the order. A rider can also accept an order if rider is available and order is pending. For a rider to accept an order, the rider must be available, he must be active(allowed to accept orders. i.e He is not blocked by the company to accept orders. Probably due to expired driving licences etc. This is the reason for isActive and isLicensed attribute of a Rider object) and the order must be pending.

If these conditions are satisfied, we update order status to IN_PROGRESS and assign the rider to the order. We then update current order of the rider to the order. We also update the current location of the rider to the pickup address of the order. Note that in a real world scenario, the rider's current_location should be updated with a location tracking service.

Third Party Users can also fetch information about orders assigned to their company.


### NOTE
Due to time constraints, and my very first time working with Typescript, I was not able to write tests for this API. If I had the time, I would use Jest framework to write unit tests and E2E tests for this API. It was great learning TypeScript with this assessment. I hope to hear a favorable response from this assessment.

THANKS.