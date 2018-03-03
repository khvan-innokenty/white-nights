<script>
    var _ROOMS_ = [
        {
            id: 101,
            title: 'Двухместный «Стандарт»',
            comment: 'Если не отметить пункт "Я хочу жить один", то в номер могут подселить ещё одного человека.',
            max_persons: 2
        },
        {
            id: 102,
            title: 'Одноместный «Стандарт»',
            comment: '',
            max_persons: 1
        },
        {
            id: 103,
            title: 'Двухкомнатный «Люкс»',
            comment: '',
            max_persons: 2
        },
        {
            id: 104,
            title: 'Трёхкомнатный «Люкс»',
            comment: '',
            max_persons: 3
        }
    ];

    var _TOURS_ = [
        {
            id: 1001,
            title: 'Идеальный вес',
            durations: [10, 14],
            prices: [
                {room: 101, from: '2018-01-09', to: '2018-02-28', price: 4907, alone: false},
                {room: 102, from: '2018-01-09', to: '2018-02-28', price: 6330, alone: false},
                {room: 103, from: '2018-01-09', to: '2018-02-28', price: 6428, alone: false},
                {room: 104, from: '2018-01-09', to: '2018-02-28', price: 7557, alone: false},
                {room: 101, from: '2018-01-09', to: '2018-02-28', price: 7360, alone: true},
                {room: 102, from: '2018-01-09', to: '2018-02-28', price: 6330, alone: true},
                {room: 103, from: '2018-01-09', to: '2018-02-28', price: 9642, alone: true},
                {room: 104, from: '2018-01-09', to: '2018-02-28', price: 11335, alone: true},

                {room: 101, from: '2018-03-01', to: '2018-06-14', price: 5160, alone: false},
                {room: 102, from: '2018-03-01', to: '2018-06-14', price: 6650, alone: false},
                {room: 103, from: '2018-03-01', to: '2018-06-14', price: 6750, alone: false},
                {room: 104, from: '2018-03-01', to: '2018-06-14', price: 7940, alone: false},
                {room: 101, from: '2018-03-01', to: '2018-06-14', price: 7730, alone: true},
                {room: 102, from: '2018-03-01', to: '2018-06-14', price: 6650, alone: true},
                {room: 103, from: '2018-03-01', to: '2018-06-14', price: 10130, alone: true},
                {room: 104, from: '2018-03-01', to: '2018-06-14', price: 11910, alone: true},

                {room: 101, from: '2018-09-01', to: '2018-12-27', price: 5160, alone: false},
                {room: 102, from: '2018-09-01', to: '2018-12-27', price: 6650, alone: false},
                {room: 103, from: '2018-09-01', to: '2018-12-27', price: 6750, alone: false},
                {room: 104, from: '2018-09-01', to: '2018-12-27', price: 7940, alone: false},
                {room: 101, from: '2018-09-01', to: '2018-12-27', price: 7730, alone: true},
                {room: 102, from: '2018-09-01', to: '2018-12-27', price: 6650, alone: true},
                {room: 103, from: '2018-09-01', to: '2018-12-27', price: 10130, alone: true},
                {room: 104, from: '2018-09-01', to: '2018-12-27', price: 11910, alone: true},

                {room: 101, from: '2018-06-15', to: '2018-08-31', price: 5680, alone: false},
                {room: 102, from: '2018-06-15', to: '2018-08-31', price: 7320, alone: false},
                {room: 103, from: '2018-06-15', to: '2018-08-31', price: 7430, alone: false},
                {room: 104, from: '2018-06-15', to: '2018-08-31', price: 8740, alone: false},
                {room: 101, from: '2018-06-15', to: '2018-08-31', price: 8510, alone: true},
                {room: 102, from: '2018-06-15', to: '2018-08-31', price: 7320, alone: true},
                {room: 103, from: '2018-06-15', to: '2018-08-31', price: 11150, alone: true},
                {room: 104, from: '2018-06-15', to: '2018-08-31', price: 13110, alone: true},
                ]
        },
        {
            id: 1002,
            title: 'Детокс',
            durations: [7, 10],
            prices: [
                {room: 101, from: '2018-02-01', to: '2018-06-30', price: 4907, alone: false},
                {room: 102, from: '2018-02-01', to: '2018-06-30', price: 6330, alone: false},
                {room: 103, from: '2018-02-01', to: '2018-06-30', price: 6428, alone: false},
                {room: 104, from: '2018-02-01', to: '2018-06-30', price: 7557, alone: false},
                {room: 101, from: '2018-02-01', to: '2018-06-30', price: 7360, alone: true},
                {room: 102, from: '2018-02-01', to: '2018-06-30', price: 6330, alone: true},
                {room: 103, from: '2018-02-01', to: '2018-06-30', price: 9642, alone: true},
                {room: 104, from: '2018-02-01', to: '2018-06-30', price: 11335, alone: true},

                {room: 101, from: '2018-07-01', to: '2018-08-31', price: 5398, alone: false},
                {room: 102, from: '2018-07-01', to: '2018-08-31', price: 6963, alone: false},
                {room: 103, from: '2018-07-01', to: '2018-08-31', price: 7071, alone: false},
                {room: 104, from: '2018-07-01', to: '2018-08-31', price: 8313, alone: false},
                {room: 101, from: '2018-07-01', to: '2018-08-31', price: 8097, alone: true},
                {room: 102, from: '2018-07-01', to: '2018-08-31', price: 6963, alone: true},
                {room: 103, from: '2018-07-01', to: '2018-08-31', price: 10606, alone: true},
                {room: 104, from: '2018-07-01', to: '2018-08-31', price: 12469, alone: true},

                {room: 101, from: '2018-09-01', to: '2018-12-28', price: 4907, alone: false},
                {room: 102, from: '2018-09-01', to: '2018-12-28', price: 6330, alone: false},
                {room: 103, from: '2018-09-01', to: '2018-12-28', price: 6428, alone: false},
                {room: 104, from: '2018-09-01', to: '2018-12-28', price: 7557, alone: false},
                {room: 101, from: '2018-09-01', to: '2018-12-28', price: 7360, alone: true},
                {room: 102, from: '2018-09-01', to: '2018-12-28', price: 6330, alone: true},
                {room: 103, from: '2018-09-01', to: '2018-12-28', price: 9642, alone: true},
                {room: 104, from: '2018-09-01', to: '2018-12-28', price: 11335, alone: true},
                ]
        },
        {
            id: 1003,
            title: 'Идеальный вес',
            durations: [14, 28],
            prices: [
                {room: 101, from: '2018-02-01', to: '2018-06-30', price: 4907, alone: false},
                {room: 102, from: '2018-02-01', to: '2018-06-30', price: 6330, alone: false},
                {room: 103, from: '2018-02-01', to: '2018-06-30', price: 6428, alone: false},
                {room: 104, from: '2018-02-01', to: '2018-06-30', price: 7557, alone: false},
                {room: 101, from: '2018-02-01', to: '2018-06-30', price: 7360, alone: true},
                {room: 102, from: '2018-02-01', to: '2018-06-30', price: 6330, alone: true},
                {room: 103, from: '2018-02-01', to: '2018-06-30', price: 9642, alone: true},
                {room: 104, from: '2018-02-01', to: '2018-06-30', price: 11335, alone: true},

                {room: 101, from: '2018-07-01', to: '2018-08-31', price: 5398, alone: false},
                {room: 102, from: '2018-07-01', to: '2018-08-31', price: 6963, alone: false},
                {room: 103, from: '2018-07-01', to: '2018-08-31', price: 7071, alone: false},
                {room: 104, from: '2018-07-01', to: '2018-08-31', price: 8313, alone: false},
                {room: 101, from: '2018-07-01', to: '2018-08-31', price: 8097, alone: true},
                {room: 102, from: '2018-07-01', to: '2018-08-31', price: 6963, alone: true},
                {room: 103, from: '2018-07-01', to: '2018-08-31', price: 10606, alone: true},
                {room: 104, from: '2018-07-01', to: '2018-08-31', price: 12469, alone: true},

                {room: 101, from: '2018-09-01', to: '2018-12-28', price: 4907, alone: false},
                {room: 102, from: '2018-09-01', to: '2018-12-28', price: 6330, alone: false},
                {room: 103, from: '2018-09-01', to: '2018-12-28', price: 6428, alone: false},
                {room: 104, from: '2018-09-01', to: '2018-12-28', price: 7557, alone: false},
                {room: 101, from: '2018-09-01', to: '2018-12-28', price: 7360, alone: true},
                {room: 102, from: '2018-09-01', to: '2018-12-28', price: 6330, alone: true},
                {room: 103, from: '2018-09-01', to: '2018-12-28', price: 9642, alone: true},
                {room: 104, from: '2018-09-01', to: '2018-12-28', price: 11335, alone: true},
                ]
        },
    ];
</script>