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
                {x: 10, y: 0, occupied: true},
                {x: 60, y: 0, occupied: false},
                {coord: [110,0], occupied: false},
                {coord: [160,0], occupied: false},
                {coord: [210,0], occupied: false},
                {coord: [260,0], occupied: false},
                {x: 10, y: 150, occupied: false},
                {x: 60, y: 150, occupied: false},
                {coord: [110,150], occupied: false},
                {coord: [160,150], occupied: false},
                {coord: [210,150], occupied: true},
                {coord: [260,150], occupied: false},
                {x: 10, y: 250, occupied: false},
                {x: 60, y: 250, occupied: false},
                {coord: [110,250], occupied: false},
                {coord: [160,250], occupied: false},
                {coord: [210,250], occupied: false},
                {coord: [260,250], occupied: false},
                {x: 10, y: 400, occupied: false},
                {x: 60, y: 400, occupied: false},
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
        capacity: 232,
        vacant: 10,
        img: '/public/images/1290 Murfin Ave Parking.png',
        layout: {
            parkSize: { width: 1600, height: 900 },
            slotSize: { width: 30, height: 80 },
            slots: [
                { x: 60, y: 200, orient: 'up', state: 'occupied' },
                { x: 90, y: 200, orient: 'up', state: 'occupied' },
                { x: 120, y: 200, orient: 'up', state: 'occupied' },
                { x: 150, y: 200, orient: 'up', state: 'occupied' },
                { x: 180, y: 200, orient: 'up', state: 'occupied' },
                { x: 210, y: 200, orient: 'up', state: 'occupied' },
                { x: 240, y: 200, orient: 'up', state: 'occupied' },
                { x: 270, y: 200, orient: 'up', state: 'occupied' },
                { x: 300, y: 200, orient: 'up', state: 'occupied' },
                { x: 330, y: 200, orient: 'up', state: 'occupied' },
                { x: 360, y: 200, orient: 'up', state: 'occupied' },
                { x: 390, y: 200, orient: 'up', state: 'occupied' },
                { x: 420, y: 200, orient: 'up', state: 'occupied' },
                { x: 450, y: 200, orient: 'up', state: 'occupied' },
                { x: 480, y: 200, orient: 'up', state: 'occupied' },
                { x: 510, y: 200, orient: 'up', state: 'occupied' },
                { x: 540, y: 200, orient: 'up', state: 'occupied' },
                { x: 570, y: 200, orient: 'up', state: 'occupied' },
                { x: 600, y: 200, orient: 'up', state: 'occupied' },
                { x: 660, y: 200, orient: 'up', state: 'occupied' },
                { x: 690, y: 200, orient: 'up', state: 'occupied' },
                { x: 720, y: 200, orient: 'up', state: 'occupied' },
                { x: 750, y: 200, orient: 'up', state: 'occupied' },
                { x: 780, y: 200, orient: 'up', state: 'occupied' },
                { x: 810, y: 200, orient: 'up', state: 'occupied' },
                { x: 840, y: 200, orient: 'up', state: 'vacant' },
                { x: 870, y: 200, orient: 'up', state: 'occupied' },
                { x: 900, y: 200, orient: 'up', state: 'occupied' },
                { x: 930, y: 200, orient: 'up', state: 'occupied' },
                { x: 960, y: 200, orient: 'up', state: 'occupied' },
                { x: 990, y: 200, orient: 'up', state: 'occupied' },
                { x: 1020, y: 200, orient: 'up', state: 'occupied' },
                { x: 1050, y: 200, orient: 'up', state: 'occupied' },
                { x: 1080, y: 200, orient: 'up', state: 'occupied' },
                { x: 1110, y: 200, orient: 'up', state: 'occupied' },
                { x: 1140, y: 200, orient: 'up', state: 'occupied' },
                { x: 1170, y: 200, orient: 'up', state: 'occupied' },
                { x: 1200, y: 200, orient: 'up', state: 'occupied' },
                { x: 1230, y: 200, orient: 'up', state: 'occupied' },
                { x: 1260, y: 200, orient: 'up', state: 'occupied' },
                { x: 1290, y: 200, orient: 'up', state: 'occupied' },
                { x: 1320, y: 200, orient: 'up', state: 'occupied' },
                { x: 1350, y: 200, orient: 'up', state: 'occupied' },
                { x: 1380, y: 200, orient: 'up', state: 'occupied' },
                { x: 60, y: 280, orient: 'down', state: 'occupied' },
                { x: 90, y: 280, orient: 'down', state: 'occupied' },
                { x: 120, y: 280, orient: 'down', state: 'occupied' },
                { x: 150, y: 280, orient: 'down', state: 'occupied' },
                { x: 180, y: 280, orient: 'down', state: 'occupied' },
                { x: 210, y: 280, orient: 'down', state: 'occupied' },
                { x: 240, y: 280, orient: 'down', state: 'occupied' },
                { x: 270, y: 280, orient: 'down', state: 'occupied' },
                { x: 300, y: 280, orient: 'down', state: 'occupied' },
                { x: 330, y: 280, orient: 'down', state: 'occupied' },
                { x: 360, y: 280, orient: 'down', state: 'occupied' },
                { x: 390, y: 280, orient: 'down', state: 'occupied' },
                { x: 420, y: 280, orient: 'down', state: 'occupied' },
                { x: 450, y: 280, orient: 'down', state: 'occupied' },
                { x: 480, y: 280, orient: 'down', state: 'occupied' },
                { x: 510, y: 280, orient: 'down', state: 'occupied' },
                { x: 540, y: 280, orient: 'down', state: 'occupied' },
                { x: 570, y: 280, orient: 'down', state: 'occupied' },
                { x: 600, y: 280, orient: 'down', state: 'occupied' },
                { x: 660, y: 280, orient: 'down', state: 'occupied' },
                { x: 690, y: 280, orient: 'down', state: 'occupied' },
                { x: 720, y: 280, orient: 'down', state: 'occupied' },
                { x: 750, y: 280, orient: 'down', state: 'occupied' },
                { x: 780, y: 280, orient: 'down', state: 'occupied' },
                { x: 810, y: 280, orient: 'down', state: 'occupied' },
                { x: 840, y: 280, orient: 'down', state: 'occupied' },
                { x: 870, y: 280, orient: 'down', state: 'occupied' },
                { x: 900, y: 280, orient: 'down', state: 'occupied' },
                { x: 930, y: 280, orient: 'down', state: 'occupied' },
                { x: 960, y: 280, orient: 'down', state: 'occupied' },
                { x: 990, y: 280, orient: 'down', state: 'occupied' },
                { x: 1020, y: 280, orient: 'down', state: 'occupied' },
                { x: 1050, y: 280, orient: 'down', state: 'occupied' },
                { x: 1080, y: 280, orient: 'down', state: 'occupied' },
                { x: 1110, y: 280, orient: 'down', state: 'occupied' },
                { x: 1140, y: 280, orient: 'down', state: 'occupied' },
                { x: 1170, y: 280, orient: 'down', state: 'occupied' },
                { x: 1200, y: 280, orient: 'down', state: 'occupied' },
                { x: 1230, y: 280, orient: 'down', state: 'occupied' },
                { x: 1260, y: 280, orient: 'down', state: 'occupied' },
                { x: 1290, y: 280, orient: 'down', state: 'occupied' },
                { x: 1320, y: 280, orient: 'down', state: 'occupied' },
                { x: 1350, y: 280, orient: 'down', state: 'occupied' },
                { x: 1380, y: 280, orient: 'down', state: 'occupied' },
                { x: 120, y: 560, orient: 'up', state: 'occupied' },
                { x: 150, y: 560, orient: 'up', state: 'occupied' },
                { x: 180, y: 560, orient: 'up', state: 'occupied' },
                { x: 210, y: 560, orient: 'up', state: 'occupied' },
                { x: 240, y: 560, orient: 'up', state: 'occupied' },
                { x: 270, y: 560, orient: 'up', state: 'occupied' },
                { x: 300, y: 560, orient: 'up', state: 'occupied' },
                { x: 330, y: 560, orient: 'up', state: 'occupied' },
                { x: 360, y: 560, orient: 'up', state: 'occupied' },
                { x: 390, y: 560, orient: 'up', state: 'occupied' },
                { x: 420, y: 560, orient: 'up', state: 'occupied' },
                { x: 450, y: 560, orient: 'up', state: 'occupied' },
                { x: 480, y: 560, orient: 'up', state: 'occupied' },
                { x: 510, y: 560, orient: 'up', state: 'occupied' },
                { x: 540, y: 560, orient: 'up', state: 'occupied' },
                { x: 570, y: 560, orient: 'up', state: 'occupied' },
                { x: 600, y: 560, orient: 'up', state: 'occupied' },
                { x: 660, y: 560, orient: 'up', state: 'occupied' },
                { x: 690, y: 560, orient: 'up', state: 'occupied' },
                { x: 720, y: 560, orient: 'up', state: 'vacant' },
                { x: 750, y: 560, orient: 'up', state: 'occupied' },
                { x: 780, y: 560, orient: 'up', state: 'occupied' },
                { x: 810, y: 560, orient: 'up', state: 'occupied' },
                { x: 840, y: 560, orient: 'up', state: 'vacant' },
                { x: 870, y: 560, orient: 'up', state: 'occupied' },
                { x: 900, y: 560, orient: 'up', state: 'occupied' },
                { x: 930, y: 560, orient: 'up', state: 'occupied' },
                { x: 960, y: 560, orient: 'up', state: 'occupied' },
                { x: 990, y: 560, orient: 'up', state: 'occupied' },
                { x: 1020, y: 560, orient: 'up', state: 'occupied' },
                { x: 1050, y: 560, orient: 'up', state: 'occupied' },
                { x: 1080, y: 560, orient: 'up', state: 'occupied' },
                { x: 1110, y: 560, orient: 'up', state: 'occupied' },
                { x: 1140, y: 560, orient: 'up', state: 'occupied' },
                { x: 1170, y: 560, orient: 'up', state: 'occupied' },
                { x: 1200, y: 560, orient: 'up', state: 'occupied' },
                { x: 1230, y: 560, orient: 'up', state: 'occupied' },
                { x: 1260, y: 560, orient: 'up', state: 'occupied' },
                { x: 1290, y: 560, orient: 'up', state: 'occupied' },
                { x: 120, y: 640, orient: 'down', state: 'occupied' },
                { x: 150, y: 640, orient: 'down', state: 'occupied' },
                { x: 180, y: 640, orient: 'down', state: 'occupied' },
                { x: 210, y: 640, orient: 'down', state: 'occupied' },
                { x: 240, y: 640, orient: 'down', state: 'occupied' },
                { x: 270, y: 640, orient: 'down', state: 'occupied' },
                { x: 300, y: 640, orient: 'down', state: 'occupied' },
                { x: 330, y: 640, orient: 'down', state: 'occupied' },
                { x: 360, y: 640, orient: 'down', state: 'occupied' },
                { x: 390, y: 640, orient: 'down', state: 'occupied' },
                { x: 420, y: 640, orient: 'down', state: 'occupied' },
                { x: 450, y: 640, orient: 'down', state: 'occupied' },
                { x: 480, y: 640, orient: 'down', state: 'occupied' },
                { x: 510, y: 640, orient: 'down', state: 'occupied' },
                { x: 540, y: 640, orient: 'down', state: 'accessible' },
                { x: 570, y: 640, orient: 'down', state: 'banned' },
                { x: 600, y: 640, orient: 'down', state: 'accessible' },
                { x: 660, y: 640, orient: 'down', state: 'accessible' },
                { x: 690, y: 640, orient: 'down', state: 'banned' },
                { x: 720, y: 640, orient: 'down', state: 'accessible' },
                { x: 750, y: 640, orient: 'down', state: 'vacant' },
                { x: 780, y: 640, orient: 'down', state: 'vacant' },
                { x: 810, y: 640, orient: 'down', state: 'occupied' },
                { x: 840, y: 640, orient: 'down', state: 'occupied' },
                { x: 870, y: 640, orient: 'down', state: 'occupied' },
                { x: 900, y: 640, orient: 'down', state: 'occupied' },
                { x: 930, y: 640, orient: 'down', state: 'occupied' },
                { x: 960, y: 640, orient: 'down', state: 'occupied' },
                { x: 990, y: 640, orient: 'down', state: 'occupied' },
                { x: 1020, y: 640, orient: 'down', state: 'occupied' },
                { x: 1050, y: 640, orient: 'down', state: 'occupied' },
                { x: 1080, y: 640, orient: 'down', state: 'occupied' },
                { x: 1110, y: 640, orient: 'down', state: 'occupied' },
                { x: 1140, y: 640, orient: 'down', state: 'occupied' },
                { x: 1520, y: 330, orient: 'left', state: 'occupied' },
                { x: 1520, y: 360, orient: 'left', state: 'vacant' },
                { x: 1520, y: 390, orient: 'left', state: 'vacant' },
                { x: 1520, y: 420, orient: 'left', state: 'vacant' },
                { x: 1520, y: 450, orient: 'left', state: 'occupied' },
                { x: 1520, y: 480, orient: 'left', state: 'vacant' }
            ]
        }
    }
];

module.exports = ParkingLotsDB;
