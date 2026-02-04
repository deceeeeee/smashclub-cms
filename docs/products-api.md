Request:
[GET] http://localhost:8080/api/v1/admin/product?keyword=&page=0&size=25
Response:
{
	"data": {
		"content": [
			{
				"category": "Makanan",
				"defaultImgLink": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWllJTIwaW5zdGFufGVufDB8fDB8fHwy",
				"id": 1,
				"productName": "Indomie",
				"status": 1
			},
			{
				"category": "Minuman",
				"defaultImgLink": "https://images.unsplash.com/photo-1629470937827-9f1c9b9df448?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				"id": 2,
				"productName": "Aquafina",
				"status": 1
			},
			{
				"category": "Minuman",
				"defaultImgLink": "https://images.unsplash.com/photo-1642532560930-77d5018c68f7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				"id": 3,
				"productName": "Red Bull",
				"status": 1
			},
			{
				"category": "Makanan",
				"defaultImgLink": "https://images.unsplash.com/photo-1679279726946-a158b8bcaa23?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				"id": 4,
				"productName": "Katsu Chicken Rice",
				"status": 1
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
	"message": "Successfully get product list!",
	"status": 200,
	"timestamp": "2026-02-04T08:54:24.145824200Z"
}