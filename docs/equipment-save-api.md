Request:
[POST] http://localhost:8080/api/v1/admin/equipment/save
{
    "equipmentName": "Raket Yonex Astrox",
    "brand": "Yonex",
    "type": "Astrox 88D Pro",
    "stock": 15,
    "price": 200000,
    "status": 1,
    "equipmentCategory": {
        "id": 1
    }
}
Response:
{
    "data": "",
    "success": true,
    "message": "Equipment saved successfully!",
    "status": 200,
    "timestamp": "2026-02-04T17:02:00.705100200Z"
}