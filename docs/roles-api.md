Request:
[GET] http://localhost:8080/admin/roles?keyword=&page=0&size=25
Response (HTTPStatus.OK):
{
	"data": {
		"content": [
			{
				"id": 1,
				"menuSet": [],
				"permissionSet": [],
				"roleCode": "DEV",
				"roleName": "Developer",
				"status": 1
			},
			{
				"id": 2,
				"menuSet": [],
				"permissionSet": [],
				"roleCode": "ADM",
				"roleName": "Admin",
				"status": 1
			},
			{
				"id": 3,
				"menuSet": [],
				"permissionSet": [],
				"roleCode": "USR",
				"roleName": "User",
				"status": 1
			}
		],
		"empty": false,
		"first": true,
		"last": true,
		"number": 0,
		"numberOfElements": 3,
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
		"totalElements": 3,
		"totalPages": 1
	},
	"success": true,
	"message": "Successfully get admin role list!",
	"status": 200,
	"timestamp": "2026-02-03T10:48:40.314801Z"
}