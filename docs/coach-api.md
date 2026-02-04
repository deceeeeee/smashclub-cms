Request:
[GET] http://localhost:8080/api/v1/admin/coach?keyword=&page=0&size=25
Response:
{
	"data": {
		"content": [
			{
				"coachCode": "CCH-01",
				"coachName": "Budi Santoso",
				"createdAt": "2026-02-04T14:29:19.6108646",
				"id": 1,
				"pricePerHour": 200000.00,
				"status": 1,
				"updatedAt": null
			},
			{
				"coachCode": "CCH-02",
				"coachName": "Aji Dumang",
				"createdAt": "2026-02-04T14:29:19.6179381",
				"id": 2,
				"pricePerHour": 150000.00,
				"status": 1,
				"updatedAt": null
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
	"message": "Successfully get coach list!",
	"status": 200,
	"timestamp": "2026-02-04T07:31:58.387716200Z"
}