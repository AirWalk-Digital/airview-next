# AI Seach Implementation


## Opensearch


 docker run -d -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" -e "OPENSEARCH_INITIAL_ADMIN_PASSWORD=sdfs987JKH98ysdhgj77FF" --name opensearch opensearchproject/opensearch:latest




### Test

Connectivity and cluster alive

```bash
curl https://localhost:9200 -ku 'admin:sdfs987JKH98ysdhgj77FF'
```


Return all documents

```bash
curl 'https://localhost:9200/_search?pretty=true&q=*:*' -ku 'admin:sdfs987JKH98ysdhgj77FF'
```

all for an test index
curl 'https://localhost:9200/_search?pretty=true&q=*:*' -ku 'admin:sdfs987JKH98ysdhgj77FF'


Create index


curl https://localhost:9200/test -ku 'admin:sdfs987JKH98ysdhgj77FF'

curl -XDEL --insecure -u 'admin:sdfs987JKH98ysdhgj77FF' 'https://localhost:9200/blah'


```bash

curl --insecure -u 'admin:sdfs987JKH98ysdhgj77FF' -X PUT "https://localhost:9200/airview" -H 'Content-Type: application/json' -d'
{
        "settings": {
            "index.knn": 'true'
        },
        "mappings": {
            "properties": {
                "embedding": {
                    "type": "knn_vector",
                    "dimension": 1536,
                    "method": {
                        "engine": "faiss",
                        "name": "hnsw"
                    }
                }
            }
        }
    }'



curl -u 'admin:sdfs987JKH98ysdhgj77FF' -X POST "https://localhost:9200/api/index_patterns/airview" -H 'osd-xsrf: true' -H 'Content-Type: application/json' -d'
{
  "airview": {
     "title": "cwl-*",
     "timeFieldName": "@timestamp"
  }
}'
```