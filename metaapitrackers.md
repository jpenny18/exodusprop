Create profit/drawdown tracker#
About#
Creates a profit/drawdown tracker

POST /users/current/accounts/:accountId/trackers
For more information see Swagger documentation

Note: a backward incompatible update is planning for this endpoint, so in order to guarantee the backward compatibility of an application, the api-version header must be set to 1 (current default value). In the future update its default value will be changed to 2.

Headers#
Name	Type	Required	Description
auth-token	string	Yes	authorization token. See Authentication & authorization
api-version	number		request version, default is 1 (will be changed in the future, see the note above)
Path parameters#
Name	Type	Required	Description
accountId	string	Yes	id of the MetaApi account
Body#
Create tracker schema: NewTracker

Response#
Responses:

201 - Profit/drawdown tracker created and tracker id returned. Response schema: {id: string}
401 - Authorization failed. Response schema: Error
404 - MetaApi account not found. Response schema: Error
Examples#
Example request:

curl -X POST --header 'Accept: application/json' --header 'auth-token: token' -d '{
  "name": "Tracker 1",
  "startBrokerTime": "2020-08-24 00:00:00.000",
  "endBrokerTime": "2020-08-24 00:00:00.000",
  "period": "day",
  "relativeDrawdownThreshold": 0.1,
  "absoluteDrawdownThreshold": 10000,
  "relativeProfitThreshold": 0.05,
  "absoluteProfitThreshold": 5000
}' 'https://risk-management-api-v1.new-york.agiliumtrade.ai/users/current/accounts/105646d8-8c97-4d4d-9b74-413bd66cd4ed/trackers'


Get tracker events#
About#
Returns tracker events by broker time range

GET /users/current/tracker-events/by-broker-time
For more information see Swagger documentation

Headers#
Name	Type	Required	Description
auth-token	string	Yes	authorization token. See Authentication & authorization
Query parameters#
Name	Type	Required	Description
startBrokerTime	string		value of the event time in broker timezone to start loading data from, inclusive, in YYYY-MM-DD HH:mm:ss.SSS format
endBrokerTime	string		value of the event time in broker timezone to end loading data at, inclusive, in YYYY-MM-DD HH:mm:ss.SSS format
accountId	string		id of the MetaApi account
trackerId	string		id of the drawdown tracker
limit	integer		pagination limit, default: 1000, min: 1, max: 1000
Response#
Responses:

200 - Tracker events returned successfully. Response schema: Array<TrackerEvent>
401 - Authorization failed. Response schema: Error
Examples#
Example request:

curl -X GET --header 'Accept: application/json' --header 'auth-token: token' 'https://risk-management-api-v1.new-york.agiliumtrade.ai/users/current/tracker-events/by-broker-time'
Example response:

[
  {
    "sequenceNumber": 1,
    "accountId": "105646d8-8c97-4d4d-9b74-413bd66cd4ed",
    "trackerId": "ABCD",
    "startBrokerTime": "2020-08-24 00:00:00.000",
    "endBrokerTime": "2020-08-24 00:00:00.000",
    "period": "day",
    "brokerTime": "2020-08-24 00:00:00.000",
    "absoluteDrawdown": 10000,
    "relativeDrawdown": 0.1,
    "absoluteProfit": 5000,
    "relativeProfit": 0.05,
    "exceededThresholdType": "drawdown"
  }
]

Get tracker events stream#
About#
Returns tracker events stream

GET /users/current/tracker-events/stream
For more information see Swagger documentation

Note: a backward incompatible update is planning for this endpoint, so in order to guarantee the backward compatibility of an application, the api-version header must be set to 1 (current default value). In the future update its default value will be changed to 2.

Headers#
Name	Type	Required	Description
auth-token	string	Yes	authorization token. See Authentication & authorization
api-version	number		request version, default is 1 (will be changed in the future, see the note above)
Query parameters#
Name	Type	Required	Description
previousSequenceNumber	integer		value of the last consumed sequence number to start streaming from, default: 0
accountId	string		id of the MetaApi account
trackerId	string		id of the tracker
limit	integer		pagination limit, default: 1000, min: 1, max: 1000
Response#
Responses:

200 - Tracker events returned successfully. Response schema: Array<TrackerEvent>
401 - Authorization failed. Response schema: Error
Examples#
Example request:

curl -X GET --header 'Accept: application/json' --header 'auth-token: token' 'https://risk-management-api-v1.new-york.agiliumtrade.ai/users/current/tracker-events/stream'
Example response:

[
  {
    "sequenceNumber": 1,
    "accountId": "105646d8-8c97-4d4d-9b74-413bd66cd4ed",
    "trackerId": "ABCD",
    "startBrokerTime": "2020-08-24 00:00:00.000",
    "endBrokerTime": "2020-08-24 00:00:00.000",
    "period": "day",
    "brokerTime": "2020-08-24 00:00:00.000",
    "absoluteDrawdown": 10000,
    "relativeDrawdown": 0.1,
    "absoluteProfit": 5000,
    "relativeProfit": 0.05,
    "exceededThresholdType": "drawdown"
  }
]

Get tracking stats#
About#
Returns account profit and drawdown tracking statistics by tracker id

GET /users/current/accounts/:accountId/trackers/:id/statistics
For more information see Swagger documentation

Note: a backward incompatible update is planning for this endpoint, so in order to guarantee the backward compatibility of an application, the api-version header must be set to 1 (current default value). In the future update its default value will be changed to 2.

Headers#
Name	Type	Required	Description
auth-token	string	Yes	authorization token. See Authentication & authorization
api-version	number		request version, default is 1 (will be changed in the future, see the note above)
Path parameters#
Name	Type	Required	Description
accountId	string	Yes	id of the MetaApi account
id	string	Yes	id of the tracker
Query parameters#
Name	Type	Required	Description
startTime	string		time to start loading stats from, in YYYY-MM-DD HH:mm:ss.SSS format. Default is current time. Note that stats is loaded in backwards direction
limit	integer		number of records to load, default: 1
realTime	boolean		if true, real-time data will be requested
Response#
Responses:

200 - Profit and drawdown statistics returned successfully. Response schema: Array<PeriodStatistics>
401 - Authorization failed. Response schema: Error
404 - MetaApi account not found. Response schema: Error
Examples#
Example request:

curl -X GET --header 'Accept: application/json' --header 'auth-token: token' 'https://risk-management-api-v1.new-york.agiliumtrade.ai/users/current/accounts/105646d8-8c97-4d4d-9b74-413bd66cd4ed/trackers/ABCD/statistics'
Example response:

[
  {
    "startBrokerTime": "2020-08-24 00:00:00.000",
    "endBrokerTime": "2020-08-25 00:00:00.000",
    "period": "day",
    "initialBalance": 10000,
    "maxDrawdownTime": "2020-08-25 00:00:00.000",
    "maxAbsoluteDrawdown": 10000,
    "maxRelativeDrawdown": 0.1,
    "maxAbsoluteProfit": 5000,
    "maxRelativeProfit": 0.05,
    "thresholdExceeded": true,
    "exceededThresholdType": "drawdown"
  }
]

Get profit/drawdown tracker by id#
About#
Returns profit/drawdown tracker by id

GET /users/current/accounts/:accountId/trackers/:id
For more information see Swagger documentation

Note: a backward incompatible update is planning for this endpoint, so in order to guarantee the backward compatibility of an application, the api-version header must be set to 1 (current default value). In the future update its default value will be changed to 2.

Headers#
Name	Type	Required	Description
auth-token	string	Yes	authorization token. See Authentication & authorization
api-version	number		request version, default is 1 (will be changed in the future, see the note above)
Path parameters#
Name	Type	Required	Description
accountId	string	Yes	id of the MetaApi account
id	string	Yes	id of the tracker
Response#
Responses:

200 - Profit/drawdown tracker returned. Response schema: Tracker
401 - Authorization failed. Response schema: Error
404 - MetaApi account not found or the tracker does not belong to the MetaApi account. Response schema: Error
Examples#
Example request:

curl -X GET --header 'Accept: application/json' --header 'auth-token: token' 'https://risk-management-api-v1.new-york.agiliumtrade.ai/users/current/accounts/105646d8-8c97-4d4d-9b74-413bd66cd4ed/trackers/ABCD'
Example response:

[
  {
    "_id": "ABCD",
    "name": "Tracker 1",
    "startBrokerTime": "2020-08-24 00:00:00.000",
    "endBrokerTime": "2020-08-24 00:00:00.000",
    "period": "day",
    "relativeDrawdownThreshold": 0.1,
    "absoluteDrawdownThreshold": 10000,
    "relativeProfitThreshold": 0.05,
    "absoluteProfitThreshold": 5000
  }
]

Get profit/drawdown tracker by name#
About#
Returns profit/drawdown tracker by name

GET /users/current/accounts/:accountId/trackers/name/:name
For more information see Swagger documentation

Note: a backward incompatible update is planning for this endpoint, so in order to guarantee the backward compatibility of an application, the api-version header must be set to 1 (current default value). In the future update its default value will be changed to 2.

Headers#
Name	Type	Required	Description
auth-token	string	Yes	authorization token. See Authentication & authorization
api-version	number		request version, default is 1 (will be changed in the future, see the note above)
Path parameters#
Name	Type	Required	Description
accountId	string	Yes	id of the MetaApi account
name	string	Yes	name of the tracker
Response#
Responses:

200 - Profit/drawdown tracker returned. Response schema: Tracker
401 - Authorization failed. Response schema: Error
404 - MetaApi account not found or the tracker does not belong to the MetaApi account. Response schema: Error
Examples#
Example request:

curl -X GET --header 'Accept: application/json' --header 'auth-token: token' 'https://risk-management-api-v1.new-york.agiliumtrade.ai/users/current/accounts/105646d8-8c97-4d4d-9b74-413bd66cd4ed/trackers/name/Tracker%201'
Example response:

[
  {
    "_id": "ABCD",
    "name": "Tracker 1",
    "startBrokerTime": "2020-08-24 00:00:00.000",
    "endBrokerTime": "2020-08-24 00:00:00.000",
    "period": "day",
    "relativeDrawdownThreshold": 0.1,
    "absoluteDrawdownThreshold": 10000,
    "relativeProfitThreshold": 0.05,
    "absoluteProfitThreshold": 5000
  }
]

Get trackers defined for an account#
About#
Returns trackers defined for an account

GET /users/current/accounts/:accountId/trackers
For more information see Swagger documentation

Note: a backward incompatible update is planning for this endpoint, so in order to guarantee the backward compatibility of an application, the api-version header must be set to 1 (current default value). In the future update its default value will be changed to 2.

Headers#
Name	Type	Required	Description
auth-token	string	Yes	authorization token. See Authentication & authorization
api-version	number		request version, default is 1 (will be changed in the future, see the note above)
Path parameters#
Name	Type	Required	Description
accountId	string	Yes	id of the MetaApi account
Response#
Responses:

200 - Account tracker definitions returned. Response schema: Array<Tracker>
401 - Authorization failed. Response schema: Error
404 - MetaApi account not found. Response schema: Error
Examples#
Example request:

curl -X GET --header 'Accept: application/json' --header 'auth-token: token' 'https://risk-management-api-v1.new-york.agiliumtrade.ai/users/current/accounts/105646d8-8c97-4d4d-9b74-413bd66cd4ed/trackers'
Example response:

[
  {
    "_id": "ABCD",
    "name": "Tracker 1",
    "startBrokerTime": "2020-08-24 00:00:00.000",
    "endBrokerTime": "2020-08-24 00:00:00.000",
    "period": "day",
    "relativeDrawdownThreshold": 0.1,
    "absoluteDrawdownThreshold": 10000,
    "relativeProfitThreshold": 0.05,
    "absoluteProfitThreshold": 5000
  }
]

Get equity chart#
About#
Returns equity chart by account id

GET /users/current/accounts/:accountId/equity-chart
For more information see Swagger documentation

Note: a backward incompatible update is planning for this endpoint, so in order to guarantee the backward compatibility of an application, the api-version header must be set to 1 (current default value). In the future update its default value will be changed to 2.

Headers#
Name	Type	Required	Description
auth-token	string	Yes	authorization token. See Authentication & authorization
api-version	number		request version, default is 1 (will be changed in the future, see the note above)
Path parameters#
Name	Type	Required	Description
accountId	string	Yes	id of the MetaApi account
Query parameters#
Name	Type	Required	Description
startTime	string		starting broker time in in YYYY-MM-DD HH:mm:ss.SSS format
endTime	string		ending broker time in in YYYY-MM-DD HH:mm:ss.SSS format
realTime	boolean		if true, real-time data will be requested
Response#
Responses:

200 - Equity chart returned successfully. Response schema: Array<EquityChartItem>
401 - Authorization failed. Response schema: Error
404 - MetaApi account not found. Response schema: Error
Examples#
Example request:

curl -X GET --header 'Accept: application/json' --header 'auth-token: token' 'https://risk-management-api-v1.new-york.agiliumtrade.ai/users/current/accounts/105646d8-8c97-4d4d-9b74-413bd66cd4ed/equity-chart'
Example response:

[
  {
    "startBrokerTime": "2020-08-24 00:00:00.000",
    "endBrokerTime": "2020-08-25 00:00:00.000",
    "averageBalance": 10000,
    "minBalance": 8000,
    "maxBalance": 12000,
    "averageEquity": 10000,
    "minEquity": 8000,
    "maxEquity": 12000,
    "startBalance": 9000,
    "startEquity": 9000,
    "lastBalance": 10000,
    "lastEquity": 10000
  }
]

Remove tracker#
About#
Removes a tracker

DELETE /users/current/accounts/:accountId/trackers/:id
For more information see Swagger documentation

Headers#
Name	Type	Required	Description
auth-token	string	Yes	authorization token. See Authentication & authorization
Path parameters#
Name	Type	Required	Description
accountId	string	Yes	id of the MetaApi account
id	string	Yes	id of the tracker
Response#
Responses:

204 - Profit/drawdown tracker removed
401 - Authorization failed. Response schema: Error
404 - MetaApi account not found. Response schema: Error
Examples#
Example request:

curl -X DELETE --header 'Accept: application/json' --header 'auth-token: token' 'https://risk-management-api-v1.new-york.agiliumtrade.ai/users/current/accounts/105646d8-8c97-4d4d-9b74-413bd66cd4ed/trackers/ABCD'

Update profit/drawdown tracker#
About#
Updates a profit/drawdown tracker

PUT /users/current/accounts/:accountId/trackers/:id
For more information see Swagger documentation

Headers#
Name	Type	Required	Description
auth-token	string	Yes	authorization token. See Authentication & authorization
Path parameters#
Name	Type	Required	Description
accountId	string	Yes	id of the MetaApi account
id	string	Yes	id of the tracker
Body#
Update tracker schema: {name: string}

Response#
Responses:

204 - Tracker updated.
401 - Authorization failed. Response schema: Error
404 - MetaApi account not found. Response schema: Error
Examples#
Example request:

curl -X PUT --header 'Accept: application/json' --header 'auth-token: token' -d '{
  "name": "Tracker 1"
}' 'https://risk-management-api-v1.new-york.agiliumtrade.ai/users/current/accounts/105646d8-8c97-4d4d-9b74-413bd66cd4ed/trackers/ABCD'

Tracker event#
About#
Drawdown/profit tracker event

Fields#
Name	Type	Required	Description
sequenceNumber	number	Yes	event unique sequence number
accountId	string	Yes	metaApi account id
trackerId	string	Yes	profit/drawdown tracker id
startBrokerTime	string(datetime)	Yes	profit/drawdown tracking period start time in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
endBrokerTime	string(datetime)		profit/drawdown tracking period end time in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
period	string	Yes	profit/drawdown tracking period. See tracking periods
brokerTime	string(datetime)	Yes	profit/drawdown threshold exceeded event time in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
absoluteDrawdown	number	Yes	absolute drawdown value which was observed when the profit or drawdown threshold was exceeded. Absolute drawdown is expressed in account currency
relativeDrawdown	number	Yes	relative drawdown value which was observed when the profit or drawdown threshold was exceeded. Relative drawdown is expressed as a fraction of 1
absoluteProfit	number	Yes	absolute profit value which was observed when the profit or drawdown threshold was exceeded. Absolute profit is expressed in account currency
relativeProfit	number	Yes	relative profit value which was observed when the profit or drawdown threshold was exceeded. Relative profit is expressed as a fraction of 1
exceededThresholdType	string	Yes	type of the exceeded threshold. One of profit, drawdown
Example#
{
  "sequenceNumber": 1,
  "accountId": "105646d8-8c97-4d4d-9b74-413bd66cd4ed",
  "trackerId": "ABCD",
  "startBrokerTime": "2020-08-24 00:00:00.000",
  "endBrokerTime": "2020-08-24 00:00:00.000",
  "period": "day",
  "brokerTime": "2020-08-24 00:00:00.000",
  "absoluteDrawdown": 10000,
  "relativeDrawdown": 0.1,
  "absoluteProfit": 5000,
  "relativeProfit": 0.05,
  "exceededThresholdType": "drawdown"
}
Usages#
REST API - API Methods - Get tracker events
REST API - API Methods - Get tracker events stream

Period statistics#
About#
Period statistics

Fields#
Name	Type	Required	Description
startBrokerTime	string(datetime)	Yes	period start time in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
endBrokerTime	string(datetime)		period end time in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
period	string	Yes	period length. See tracking periods
initialBalance	number	Yes	balance at period start time
maxDrawdownTime	string(datetime)		time max drawdown was observed at in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
maxAbsoluteDrawdown	number		the value of maximum absolute drawdown observed. Absolute drawdown is expressed in account currency
maxRelativeDrawdown	number		the value of maximum relative drawdown observed. A fraction of 1
maxProfitTime	string(datetime)		time max profit was observed at in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
maxAbsoluteProfit	number		the value of maximum absolute profit observed. Absolute profit is expressed in account currency
maxRelativeProfit	number		the value of maximum relative profit observed. A fraction of 1
thresholdExceeded	boolean	Yes	the flag indicating that max allowed total drawdown was exceeded
exceededThresholdType	string		type of the exceeded threshold. One of profit, drawdown
balanceAdjustment	number		balance adjustment applied to equity for tracking drawdown/profit
tradeDayCount	number		count of days when trades were performed during the period
Example#
{
  "startBrokerTime": "2020-08-24 00:00:00.000",
  "endBrokerTime": "2020-08-25 00:00:00.000",
  "period": "day",
  "initialBalance": 10000,
  "maxDrawdownTime": "2020-08-25 00:00:00.000",
  "maxAbsoluteDrawdown": 1000,
  "maxRelativeDrawdown": 0.1,
  "maxAbsoluteProfit": 500,
  "maxRelativeProfit": 0.05,
  "thresholdExceeded": true,
  "exceededThresholdType": "drawdown"
}
Usages#
REST API - API Methods - Get tracking statistics

Tracker#
About#
Drawdown/profit tracker

Fields#
Name	Type	Required	Description
_id	string	Yes	unique drawdown tracker id
name	string	Yes	drawdown tracker name
startBrokerTime	string(datetime)		time to start tracking from in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
endBrokerTime	string(datetime)		time to end tracking at in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
period	string	Yes	drawdown tracking period. See tracking periods
relativeDrawdownThreshold	number		relative drawdown threshold after which drawdown event is generated. A fraction of 1
absoluteDrawdownThreshold	number		absolute drawdown threshold after which tracker event is generated. Absolute drawdown is expressed in account currency. Should be greater than 0
relativeProfitThreshold	number		relative profit threshold after which tracker event is generated. A fraction of 1
absoluteProfitThreshold	number		absolute profit threshold after which tracker event is generated. Absolute profit is expressed in account currency. Should be greater than 0
Example#
{
  "_id": "ABCD",
  "name": "Tracker 1",
  "startBrokerTime": "2020-08-24 00:00:00.000",
  "endBrokerTime": "2020-08-24 00:00:00.000",
  "period": "day",
  "relativeDrawdownThreshold": 0.1,
  "absoluteDrawdownThreshold": 10000,
  "relativeProfitThreshold": 0.05,
  "absoluteProfitThreshold": 5000
}
Usages#
REST API - API Methods - Get tracker
REST API - API Methods - Get trackers

Equity chart item#
About#
Equity chart item

Fields#
Name	Type	Required	Description
startBrokerTime	string(datetime)	Yes	start time of a chart item as per broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
endBrokerTime	string(datetime)	Yes	end time of a chart item as per broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
averageBalance	number	Yes	average balance value during the period
minBalance	number	Yes	minimum balance value during the period
maxBalance	number	Yes	maximum balance value during the period
averageEquity	number	Yes	average equity value during the period
minEquity	number	Yes	minimum equity value during the period
maxEquity	number	Yes	maximum equity value during the period
startBalance	number	Yes	starting balance value observed during the period
startEquity	number	Yes	starting equity value observed during the period
lastBalance	number	Yes	last balance value observed during the period
lastEquity	number	Yes	last equity value observed during the period
Example#
{
  "startBrokerTime": "2020-08-24 00:00:00.000",
  "endBrokerTime": "2020-08-25 00:00:00.000",
  "averageBalance": 10000,
  "minBalance": 8000,
  "maxBalance": 12000,
  "averageEquity": 10000,
  "minEquity": 8000,
  "maxEquity": 12000,
  "startBalance": 9000,
  "startEquity": 9000,
  "lastBalance": 10000,
  "lastEquity": 10000
}
Usages#
REST API - API Methods - Get equity chart

Error#
About#
Contains an error message.

Fields#
Name	Type	Required	Description
id	integer	Yes	Error id
error	string	Yes	Error name
numericCode	integer		Numeric error code
stringCode	string		String error code
message	string	Yes	Human-readable error message
details	object		Additional information about error. Used to supply validation error details
Example#
{
  "id": 7,
  "error": "NotFoundError",
  "message": "Account id 865d3a4d-3803-486d-bdf3-a85679d9fad2 is not found for user Mike"
}
Usages#
All responses of REST API

New profit/drawdown tracker#
About#
New profit/drawdown tracker

Fields#
Name	Type	Required	Description
name	string	Yes	drawdown tracker name
startBrokerTime	string(datetime)		time to start tracking from in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
endBrokerTime	string(datetime)		time to end tracking at in broker timezone (in YYYY-MM-DD HH:mm:ss.SSS format)
period	string	Yes	drawdown tracking period. See tracking periods
relativeDrawdownThreshold	number		relative drawdown threshold after which drawdown event is generated. A fraction of 1
absoluteDrawdownThreshold	number		absolute drawdown threshold after which tracker event is generated. Absolute drawdown is expressed in account currency. Should be greater than 0
relativeProfitThreshold	number		relative profit threshold after which tracker event is generated. A fraction of 1
absoluteProfitThreshold	number		absolute profit threshold after which tracker event is generated. Absolute profit is expressed in account currency. Should be greater than 0
Example#
{
  "name": "Tracker 1",
  "startBrokerTime": "2020-08-24 00:00:00.000",
  "endBrokerTime": "2020-08-24 00:00:00.000",
  "period": "day",
  "relativeDrawdownThreshold": 0.1,
  "absoluteDrawdownThreshold": 10000,
  "relativeProfitThreshold": 0.05,
  "absoluteProfitThreshold": 5000
}
Usages#
REST API - API Methods - Create tracker