## send http request to logstash
```bash
curl -X PUT http://127.0.0.1:8080 \
     -H "Content-Type: application/json" \
     -d '{ "name": "henry", "quantity": "10" }'
```

## logstash execution model
input(codec) (event)=> worker queue (batch)=> worker A,B,... (filter, output, codec)