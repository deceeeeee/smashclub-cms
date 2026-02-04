Request:
[POST] http://localhost:8080/admin/roles/save
{
    roleCode: "",
    roleName: "",
    status: 1,
    menuSet: [
        {
            id: 1
        }
    ],
    permissionSet: [
        {
            id: 1
        }
    ]
}
Response (HTTPStatus.OK):
{
	"data": "",
	"success": true,
	"message": "Successfully save role data!",
	"status": 200,
	"timestamp": "2026-02-03T10:48:40.314801Z"
}