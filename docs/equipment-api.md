Request:
[GET] http://localhost:8080/api/v1/admin/equipment?keyword=&page=0&size=25
Response:
{
	"data": {
		"content": [
			{
				"brand": "Wilson",
				"createdAt": "2026-02-04 15:26:10",
				"equipmentCategory": {
					"categoryName": "Raket",
					"id": 1
				},
				"equipmentName": "Raket A",
				"id": 1,
				"price": 80000.00,
				"status": 1,
				"stock": 10,
				"type": "Power Rackets"
			},
			{
				"brand": "Yonex",
				"createdAt": "2026-02-04 15:26:10",
				"equipmentCategory": {
					"categoryName": "Raket",
					"id": 1
				},
				"equipmentName": "Raket B",
				"id": 2,
				"price": 120000.00,
				"status": 1,
				"stock": 5,
				"type": "Control/Player Rackets"
			},
			{
				"brand": "Wilson",
				"createdAt": "2026-02-04 15:26:10",
				"equipmentCategory": {
					"categoryName": "Bola",
					"id": 2
				},
				"equipmentName": "Bola A",
				"id": 3,
				"price": 65000.00,
				"status": 1,
				"stock": 100,
				"type": "Pressurized Ball"
			},
			{
				"brand": "Yonex",
				"createdAt": "2026-02-04 15:26:10",
				"equipmentCategory": {
					"categoryName": "Bola",
					"id": 2
				},
				"equipmentName": "Bola B",
				"id": 4,
				"price": 50000.00,
				"status": 1,
				"stock": 80,
				"type": "Pressureless Ball"
			}
		],
		"empty": false,
		"first": true,
		"last": true,
		"number": 0,
		"numberOfElements": 4,
		"pageable": {
			"offset": 0,
			"pageNumber": 0,
			"pageSize": 25,
			"paged": true,
			"sort": {
				"empty": true,
				"sorted": false,
				"unsorted": true
			},
			"unpaged": false
		},
		"size": 25,
		"sort": {
			"empty": true,
			"sorted": false,
			"unsorted": true
		},
		"totalElements": 4,
		"totalPages": 1
	},
	"success": true,
	"message": "Successfully get equipment list!",
	"status": 200,
	"timestamp": "2026-02-04T08:26:17.894175Z"
}