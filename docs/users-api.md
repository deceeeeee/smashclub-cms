Request:
[GET] http://localhost:8080/admin/users?keyword=&page=0&size=25
Response (HTTPStatus.OK):
{
	"data": {
		"content": [
			{
				"adminRole": {
					"roleCode": "DEV",
					"roleName": "Developer"
				},
				"createdAt": "2026-02-04 11:47:02",
				"fullName": "Developer",
				"id": 1,
				"status": 1,
				"updatedAt": null,
				"username": "developer"
			}
		],
		"empty": false,
		"first": true,
		"last": true,
		"number": 0,
		"numberOfElements": 1,
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
		"totalElements": 1,
		"totalPages": 1
	},
	"success": true,
	"message": "Successfully get admin user list!",
	"status": 200,
	"timestamp": "2026-02-04T04:48:06.341065300Z"
}