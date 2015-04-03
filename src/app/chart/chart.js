var WIDTH_CHART = 830;
var HEIGHT_CHART = 150;
var X_START = 26;
var Y_START = 20;
var X_END = X_START + WIDTH_CHART;
var DISTANCE_LABEL_X = X_END / 14;
var DISTANCE_ROW = 20;
var NUMBER_ROW = 6;
var SPEET = 300;
var Y_END = Y_START + DISTANCE_ROW * NUMBER_ROW;

var chart = {};
chart = {
    init :{
        point_y_center: DISTANCE_ROW * NUMBER_ROW / 2,
        coordinatesOneUnitPrice: 0,
        arrPoint : []
    },

    drawChart : function(paper, data){
        chart.drawBackground(paper,data);
        if(data.data.length > 0){
            chart.initArrayPoint(data,paper);
            chart.drawRecWhite(chart.init.arrPoint,paper);
            chart.yAxis(paper);
            chart.drawLine(paper, data.data);
            
        } else {
            chart.yAxis(paper);
        }    

    },
    // calculator value of one distance y
    initArrayPoint : function(data){
        var max = data.max;
        var min = data.min;
        var valueMinY = parseValueMinPrice(min);
        var valueMaxY = parseValueMaxPrice(max);
        chart.init.arrPoint = [];
        var x = X_START;
        var i, y, price, point;
        if(max == min){
            for (i = 0; i < data.data.length; i++) {
                price = data.data[i].price;
                y = 0;
                if(max === 0){
                    y = Y_END;
                }else{
                    y = chart.init.point_y_center + Y_START;
                }
                point = {x : x, y : y};
                chart.init.arrPoint.push(point);
                x = x + DISTANCE_LABEL_X;
            }
            return;

        }

        //based on max,min of price to draw point in the chart
        chart.init.coordinatesOneUnitPrice = (Y_END - Y_START) / (valueMaxY - valueMinY);
        for (i = 0; i < data.data.length; i++) {
            price = data.data[i].price;
            y = (parseFloat(price.replace(",", "")) - valueMinY )* chart.init.coordinatesOneUnitPrice;
            y = Y_END - y;
            point = {x : x, y : y};        
            chart.init.arrPoint.push(point);
            x = x + DISTANCE_LABEL_X;
        }
    },

    drawBackground : function(paper,data){        
        chart.xLabel(paper,data);
    },

    yAxis : function(paper){
       for(var i = 0; i <= NUMBER_ROW; i++){
            var point_y = Y_START + DISTANCE_ROW * i;
            var p1 = new Point(0, point_y);
            var p2 = new Point(X_END, point_y);
            drawLine(p1, p2, "#E6E6E6", 0.5, paper);
       }
    },

    xLabel : function(paper,data){
        var lableText = [];
        lableText.length = 0;
        var date;
        var max = data.data[0].price;
        for (var i = 0; i < data.data.length; i++) {
            date = data.data[i].date_time.split('-');
            lableText[i] = date[2]+"/"+date[1];
            if(data.data[i].price > max){
                max = data.data[i].price;
            }
            
        }
        
        for(i = 0; i < lableText.length; i++){
            var point_x = X_START + DISTANCE_LABEL_X * i;
            var  point_y = Y_START + DISTANCE_ROW  * NUMBER_ROW;
            var p1 = new Point(point_x, point_y);

            var point_y1 = point_y + 5;
            var p2 = new Point(point_x, point_y1);

            drawLine(p1, p2, "#3C4B58", 1, paper);

            var point_y_label = point_y1 + 10;
            var point_text = new Point(point_x, point_y_label);

            drawText(point_text, lableText[i], 0, 12, "#3C4B58", 500, paper);
        }

        //set color for chart
        //var d = "M 20,20  L 809, 20 L 809,120  L 20, 120";
        var d = "M 26,20  L 820, 20 L 820,120  L 26, 120 L 26,20";
        var tri = paper.path(d).attr({"fill": "90-rgba(18,106,217,0.0)-rgba(18,106,217,0.1)",
                "stroke-width": 0
        });
    },

    drawRecWhite : function(data,paper){
        //set white color for chart above
         var chart_init = data;
        var d = "M "+ chart_init[0].x +"," +chart_init[0].y +" L " +chart_init[1].x +"," +chart_init[1].y +
                " L " +chart_init[2].x +"," +chart_init[2].y +" L " +chart_init[3].x +"," +chart_init[3].y +
                " L " +chart_init[4].x +"," +chart_init[4].y +" L " +chart_init[5].x +"," +chart_init[5].y +
                " L " +chart_init[6].x +"," +chart_init[6].y +" L " +chart_init[7].x +"," +chart_init[7].y +
                " L " +chart_init[8].x +"," +chart_init[8].y +" L " +chart_init[9].x +"," +chart_init[9].y +
                " L " +chart_init[10].x +"," +chart_init[10].y +" L " +chart_init[11].x +"," +chart_init[11].y +
                " L " +chart_init[12].x +"," +chart_init[12].y +" L " +chart_init[13].x +"," +chart_init[13].y +
                 " L 824 20 L 26 20 L 0 0 "
                 //" L 824 20 L 0 0"
                ;
        var tri = paper.path(d).attr({
            "fill": "#ffffff",
            "stroke-width": 0
        });
        
    },

    drawLine : function(paper, arrData){
        var arrPoint = chart.init.arrPoint;
        drawCurve(arrPoint, '#146ad9', 1.25 , paper);

        for(var i = 0; i < arrPoint.length; i++){
            var point = new Point(arrPoint[i].x, arrPoint[i].y);
            var data = arrData[i];
            // drawDot(point, 5, '#ffffff', '#EFEAEA', 2, paper, data);
            drawDot(point, 4, '#146ad9', '#ffffff', 0, paper, data);

        }
    }
};

function parseValueMinPrice(value){
    value = parseInt(value, 10);
    return value - value % 100;
}

function parseValueMaxPrice(value){
    value = parseInt(value, 10);
    if(value % 100 === 0) {
        return value;
    }
    return value - value % 100 + 100;
}