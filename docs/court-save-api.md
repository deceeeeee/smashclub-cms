Request:
[POST] http://localhost:8080/api/v1/admin/court/save
{
    "courtCode": "CC",
    "courtName": "Court C",
    "openTime": "08:00",
    "closeTime": "17:00",
    "status": 1
}
Response: 
{
	"path": "/api/v1/admin/court/save",
	"data": "",
	"success": false,
	"errorCode": "X02001",
	"message": "Rollback untuk Transaksi Telah dilakukan",
	"status": 400,
	"timestamp": "2026-02-04T08:19:52.970206600Z"
}