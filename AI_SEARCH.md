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
'https://localhost:9200/_search?pretty=true&q=*:*' -ku 'admin:sdfs987JKH98ysdhgj77FF'
```
