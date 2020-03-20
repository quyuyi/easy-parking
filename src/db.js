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
            parkSize: {length: 600, width: 400},
            slotSize: {length: 100, width: 50},
            slots: [
                {coord: [10, 0], occupied: true},
                {coord: [60, 0], occupied: false},
                {coord: [110,0], occupied: false},
                {coord: [160,0], occupied: false},
                {coord: [210,0], occupied: false},
                {coord: [260,0], occupied: false},
                {coord: [10, 150], occupied: false},
                {coord: [60, 150], occupied: false},
                {coord: [110,150], occupied: false},
                {coord: [160,150], occupied: false},
                {coord: [210,150], occupied: true},
                {coord: [260,150], occupied: false},
                {coord: [10, 250], occupied: false},
                {coord: [60, 250], occupied: false},
                {coord: [110,250], occupied: false},
                {coord: [160,250], occupied: false},
                {coord: [210,250], occupied: false},
                {coord: [260,250], occupied: false},
                {coord: [10, 400], occupied: false},
                {coord: [60, 400], occupied: false},
                {coord: [110,400], occupied: false},
                {coord: [160,400], occupied: false},
                {coord: [210,400], occupied: false},
                {coord: [260,400], occupied: false},
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
