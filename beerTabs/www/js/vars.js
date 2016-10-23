angular.module('shopifyVars',[])
.constant('baseUrl','http://localhost:3000/webservice/')
.constant('apiKey','61cdb5ad5e10b17044a5b6d2e7371cad')
.value('collections',[{
    "id": 336698825,
    "handle": "beers",
    "title": "Beers",
    "updated_at": "2016-10-22T16:19:46-02:00",
    "body_html": "Beers",
    "published_at": "2016-10-22T16:19:00-02:00",
    "sort_order": "alpha-asc",
    "template_suffix": "",
    "published_scope": "global",
    "image": {
        "created_at": "2016-10-22T16:19:37-02:00",
        "src": "https://cdn.shopify.com/s/files/1/1559/3777/collections/itaipava.jpg?v=1477160377"
    }
},
{
    "id": 336698697,
    "handle": "vinhos",
    "title": "Wines",
    "updated_at": "2016-10-22T16:21:53-02:00",
    "body_html": "Wines",
    "published_at": "2016-10-22T16:17:00-02:00",
    "sort_order": "alpha-asc",
    "template_suffix": "",
    "published_scope": "global",
    "image": {
        "created_at": "2016-10-22T16:18:57-02:00",
        "src": "https://cdn.shopify.com/s/files/1/1559/3777/collections/chalise.jpg?v=1477160337"
    }
}
]);