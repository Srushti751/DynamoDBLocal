"use strict";

const { DynamoDB } = require("aws-sdk");
const aws = require("aws-sdk");

// Connection with local dynamodb
aws.config.update({
  region: "ap-southeast-1",
  endpoint: "http://localhost:8000",
});

const db = new DynamoDB.DocumentClient();
const dynamodb = new aws.DynamoDB({ apiVersion: "2012-08-10" });

// const TableName = "Devices";

// To create Table for the first time in local dynamodb
module.exports.createTable = async (event) => {
  var params = {
    TableName: "TABB",
    KeySchema: [
      {
        AttributeName: "thingid",
        KeyType: "HASH",
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "thingid",
        AttributeType: "S",
      },
      {
        AttributeName: "partnumber",
        AttributeType: "N",
      },
      {
        AttributeName: "devicetype",
        AttributeType: "S",
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "TABB-index",
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          WriteCapacityUnits: 5,
          ReadCapacityUnits: 10,
        },
        KeySchema: [
          {
            KeyType: "HASH",
            AttributeName: "partnumber",
          },
          {
            KeyType: "RANGE",
            AttributeName: "devicetype",
          },
        ],
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };
  dynamodb.createTable(params, function (err, data) {
    if (err) console.log(err); // an error occurred
    else return { statusCode: 200, body: JSON.stringify("table created") }; // successful response
  });
};

// To add  items in local dynamodb
module.exports.localcreate = async (event) => {
  const device = {
    thingid: String(Math.random() * 100),
    partnumber: JSON.parse(event.body).pt,
    devicetype: JSON.parse(event.body).dt,
  };

  await db
    .put({
      TableName: "TABB",
      IndexName: "TABB-index",
      Item: device,
    })
    .promise();
};

// To get count & list  of particular type of data from local dynamodb
module.exports.localget = async (event) => {
  async function loopQuery(params) {
    let keepGoing = true;
    let result = null;
    let list = [];
    let count = 0;
    while (keepGoing) {
      let newParams = params;

      if (result && result.LastEvaluatedKey) {
        newParams = {
          ...params,
          ExclusiveStartKey: result.LastEvaluatedKey,
        };
      }
      result = await db.query(newParams).promise();
      count = count + result.Count;
      list = [...list, ...result.Items];

      if (!result.LastEvaluatedKey) {
        keepGoing = false;
      }
    }

    let obj = { list: list, count: count };
    return obj;
  }

  var params = {
    TableName: "TABB",
    IndexName: "TABB-index",
    ExpressionAttributeValues: {
      ":dt": JSON.parse(event.body).dt,
      ":pt": JSON.parse(event.body).pt,
    },
    KeyConditionExpression: "devicetype =:dt and partnumber =:pt",
    Limit: 10,
  };

  const result = await loopQuery(params);
  let resObj = { totalcount: result.count, list: result.list };
  return { statusCode: 200, body: JSON.stringify(resObj) };
};

// Returns all items
module.exports.list = async (event, context, callback) => {
  const params = {
    TableName: "TABB",
    IndexName: "TABB-index",

    Select: "ALL_ATTRIBUTES",
  };

  return db
    .scan(params)
    .promise()
    .then((data) => {
     
      callback(null, { statusCode: 200, body: JSON.stringify(data) });
    })
    .catch((err) => {
      console.log(err);
      callback(err, { statusCode: 500, body: "error" });
    });
};
