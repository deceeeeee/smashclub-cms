Request:
[GET] http://localhost:8080/api/v1/admin/equipment-category?keyword=&page=0&size=25
Response:
{
	"data": {
		"content": [
			{
				"categoryName": "Raket",
				"id": 1,
				"status": 1
			},
			{
				"categoryName": "Bola",
				"id": 2,
				"status": 1
			}
		],
		"empty": false,
		"first": true,
		"last": true,
		"number": 0,
		"numberOfElements": 2,
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
		"totalElements": 2,
		"totalPages": 1
	},
	"success": true,
	"message": "Successfully get equipment category list!",
	"status": 200,
	"timestamp": "2026-02-04T16:29:32.132536200Z"
}