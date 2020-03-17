const ParkingLotsDB = [
    {
        position: {
            lat: 42.293658,
            lng: -83.713711
        },
        title: '2182-2306 Hayward St Parking',
        address: '2182-2306 Hayward St, Ann Arbor, MI 48109',
        capacity: 30,
        img: '/public/images/2182-2306 Hayward St Parking.png',
        layout: {
            length: 100,
            width: 50,
            slots: [
                {
                    coord: [10,0],
                    occupied: true
                },
                [10,0], [60,0], [110,0], [160,0], [210,0], [260,0],
                [10,150], [60,150], [110,150], [160,150], [210,150], [260,150],
                [10,250], [60,250], [110,250], [160,250], [210,250], [260,250],
                [10,400], [60,400], [110,400], [160,400], [210,400], [260,400],
            ],
            dash: [
                [10,250,'x',260]
            ]
        }
    },

    {
        position: {
            lat: 42.292365,
            lng: -83.717618
        },
        title: '1290 Murfin Ave Parking',
        address: '1290 Murfin Ave, Ann Arbor, MI 48109',
        capacity: 45,
        img: '/public/images/1290 Murfin Ave Parking.png'
    }
];

module.exports = ParkingLotsDB;
