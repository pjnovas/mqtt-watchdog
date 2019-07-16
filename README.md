[WIP]

This is a nodejs subscriber to MQTT topics and storage of messages into a database.
The main purpose of this process is to watch my MQTT topics and take different actions, so far just to store 'em.

```
npm install
```

```
HOST=mqtt.example.com npm start
```

# Using Docker

Build the image
```
docker build -t mqtt-watchdog .
```

Run it
```
docker run -i -e HOST='mqtt.example.com' mqtt-watchdog
```

