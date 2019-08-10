# MQTT Watchdog 

This is a nodejs subscriber to MQTT topics and storage of messages into a database.
The main purpose of this process is to watch my MQTT topics and take different actions, so far just to store 'em.

```
npm install
```

```
HOST=mqtt.example.com npm start
```

You need mongodb so you can just start one from docker:
```
docker run -p 27017:27017 mongo
```

## Using Docker

With docker-compose:

```
docker-compose up --build
```

or  


Build the image
```
docker build -t mqtt-watchdog .
```

Run it
```
docker run -i -e HOST='mqtt.example.com' mqtt-watchdog
```

## How is data stored

Assuming the topic subscribed to is `stove/#` and a message from that device is executed as `stove/status` with a message `ONLINE` here is how data would looks like:

get into de mongo container running by doing
```
docker exec -it [container-id] mongo
```

```
> use mqtt-watchdog
switched to db mqtt-watchdog
> show collections
stove_status
> db.stove_status
mqtt-watchdog.stove_status
> db.stove_status.find()
{ "_id" : ObjectId("5d2de25a4029ca0195096228"), "message" : "ONLINE" }
```

It will create a collection per topic replacing hierarchy `/` by `_` and then it will create a document with the message received.

As mongodb has an generated `_id` which already is a timestamp, time could be resolved from it like:

```
> ObjectId("5d2de25a4029ca0195096228").getTimestamp()
ISODate("2019-07-16T14:42:34Z")
```

## How to get data stored

[TODO]

