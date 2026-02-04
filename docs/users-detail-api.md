Request:
[GET] http://localhost:8080/admin/users/:id
Response (HTTPStatus.OK):
{
	"data": {
		"adminRole": {
			"id": 1,
			"roleCode": "DEV",
			"roleName": "Developer"
		},
		"fullname": "Developer",
		"id": 1,
		"status": 1,
		"username": "developer"
	},
	"success": true,
	"message": "User data found!",
	"status": 200,
	"timestamp": "2026-02-04T05:02:40.660627300Z"
}