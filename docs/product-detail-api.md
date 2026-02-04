Request:
[GET] http://localhost:8080/api/v1/admin/product/:productId
Response:
{
	"data": {
		"category": "Makanan",
		"defaultImgLink": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWllJTIwaW5zdGFufGVufDB8fDB8fHwy",
		"id": 1,
		"productName": "Indomie",
		"productVariants": [
			{
				"id": 1,
				"name": "Indomie Goreng",
				"price": 15000.00,
				"sku": "INDM-001",
				"stock": 25,
				"variantImgLink": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWllJTIwaW5zdGFufGVufDB8fDB8fHwy"
			},
			{
				"id": 2,
				"name": "Indomie Rasa Kari Ayam",
				"price": 13000.00,
				"sku": "INDM-002",
				"stock": 36,
				"variantImgLink": "https://images.unsplash.com/photo-1628610688436-e635552020fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWllJTIwaW5zdGFufGVufDB8fDB8fHwy"
			},
			{
				"id": 3,
				"name": "Indomie Rasa Ayam Bawang",
				"price": 13000.00,
				"sku": "INDM-003",
				"stock": 40,
				"variantImgLink": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWllJTIwaW5zdGFufGVufDB8fDB8fHwy"
			},
			{
				"id": 4,
				"name": "Indomie Rasa Soto",
				"price": 13000.00,
				"sku": "INDM-004",
				"stock": 21,
				"variantImgLink": "https://images.unsplash.com/photo-1628610688436-e635552020fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWllJTIwaW5zdGFufGVufDB8fDB8fHwy"
			}
		],
		"status": 1
	},
	"success": true,
	"message": "Product data found!",
	"status": 200,
	"timestamp": "2026-02-04T17:38:46.638854600Z"
}