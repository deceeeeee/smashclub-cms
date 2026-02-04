Request:
[GET] http://localhost:8080/api/v1/admin/court?keyword=&page=0&size=25
Response:
{
	"data": {
		"content": [
			{
				"closeTime": "23:00",
				"courtCode": "CT01",
				"courtName": "Court A",
				"createdAt": "2026-02-04 14:29:19",
				"id": 1,
				"openTime": "08:00",
				"status": 1,
				"statusDesc": null,
				"updatedAt": null
			},
			{
				"closeTime": "20:00",
				"courtCode": "CT02",
				"courtName": "Court B",
				"createdAt": "2026-02-04 14:29:19",
				"id": 2,
				"openTime": "07:00",
				"status": 1,
				"statusDesc": null,
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
	"message": "Successfully get court list!",
	"status": 200,
	"timestamp": "2026-02-04T07:30:07.140901600Z"
}