$(function() {

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: '2013',
            a: 50,
            b: 20,
            c: 20
        }, {
            y: '2014',
            a: 70,
            b: 50,
            c: 46
        }, {
            y: '2015',
            a: 60,
            b: 40,
            c: 38
        }, {
            y: '2016',
            a: 90,
            b: 50,
            c: 50
        }, {
            y: '2017',
            a: 100,
            b: 99,
            c: 94
        }, {
            y: '2018',
            a: 40,
            b: 30,
            c: 30
        }],
        xkey: 'y',
        ykeys: ['a', 'b', 'c'],
        labels: ['总数', '核实' ,'处理'],
        hideHover: 'auto',
        resize: true
    });
    
});
