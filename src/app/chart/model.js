//===============================POINT========================================

//create a Point object
function Point(x, y) {
    this.x = x;
    this.y = y;
}
//===============================DOT for Weigth Chart=====================================

//create a Dot object
function Dot(Point, radius, fillColor, borderColor, borderWeight, objPaper) {
    this.startPoint = Point;
    this.radius = radius;
    this.border = borderWeight;
    this.borderColor = borderColor;
    this.fillColor = fillColor;
    this.paper = objPaper;
}

Dot.prototype.draw = function(data) {

    var r = this.radius;
    var fill = this.fillColor;
    var stroke = this.borderColor;
    var stroke_width = this.borderWeight;
    var paper = this.paper;
    var point = this.startPoint;


    var circle = paper.circle(this.startPoint.x, this.startPoint.y, r).attr({
        "fill" : fill, // background color
        "fill-opacity":0,
        "stroke" : stroke, // border color
        "stroke-width" : stroke_width, // border width
        "stroke-opacity":0,
        'cursor': 'pointer'
    });
    var rec;
    var  txt_price;
    var text_date;
    var width_rec = 85, height_rec = 30;
    var point_x_rec = point.x - width_rec / 2;
    var point_y_rec = point.y - height_rec - 5;

    var txt_price_x = point_x_rec + width_rec / 2;
    var txt_price_y = point_y_rec + 12;

    var txt_date_x = point_x_rec + width_rec / 2;
    var txt_date_y = point_y_rec + 22;
    var fill_rec = "url(assets/imgs/popup-dash-buttom.png)";

    if(point.x - width_rec / 2 < 0){
        fill_rec = "url(assets/imgs/popup-dash-left.png)";
        width_rec = width_rec + 1;
        height_rec = height_rec - 6;

        point_x_rec = point.x + 6;
        point_y_rec = point.y - height_rec / 2;

        txt_price_x = point_x_rec + width_rec / 2 + 5;
        txt_price_y = point_y_rec + 10;

        txt_date_x = txt_price_x;
        txt_date_y = txt_price_y + 12;
    }else if(point.x + width_rec > X_END){
        fill_rec = "url(assets/imgs/popup-dash-right.png)";
        // width_rec = width_rec + 1;
        height_rec = height_rec - 6;

        point_x_rec = point.x - width_rec - 6;
        point_y_rec = point.y - height_rec / 2;

        txt_price_x = point_x_rec + width_rec / 2 - 4;
        txt_price_y = point_y_rec + 10;

        txt_date_x = txt_price_x;
        txt_date_y = txt_price_y + 12;
    }else if(point.y  - height_rec < 0){
        fill_rec = "url(assets/imgs/popup-dash-top.png)";
        point_y_rec = point.y + 5;
        txt_price_y = point_y_rec + 17;
        txt_date_y = txt_price_y + 12;
    }

    circle.hover(function(){
        // alert(fill);
        this.attr('style','');
        this.attr('fill-opacity',1);
        this.attr('stroke-opacity',1);
        rec = this.paper.rect(point_x_rec, point_y_rec, 0, 0, 0).attr({
            "opacity" : 0,
            "stroke" : "#ffffff",
            "fill" : fill_rec
        });

        rec.animate({
            "opacity" : 1,
            width: width_rec,
            height: height_rec,
            "fill" : fill_rec
        }, SPEET);
        //Draw text value transaction
        txt_price = paper.text(txt_price_x, txt_price_y , "$" + data.price).attr({
            "fill" : '#ffffff', // font-color
            // "font-size" : 0,
            "text-anchor" : "middle",
            "font-family" : "SansPro" , // font family of the text
            "transform" : "r0",
            "font-weight": 400
        });

        txt_price.animate({
            "font-size" : 12
        }, SPEET);

        // var date_time = moment(data.date_time).format('MM/D hh:mm a');
        // txt_date = paper.text(txt_date_x, txt_date_y , date_time).attr({
        //     "fill" : '#ffffff', // font-color
        //     "font-size" : 0,
        //     "text-anchor" : "middle",
        //     "font-family" : "SansPro" , // font family of the text
        //     "transform" : "r0",
        //     "font-weight": 500
        // });

        // txt_date.animate({
        //     "font-size" : 10
        // }, SPEET);

        circle.animate({
            r: 5,
            "fill": fill,
            "stroke" : "#fff",
            "stroke-width": 2
        }, SPEET);
    });

    circle.mouseout(function(){
        this.attr('style','');
        this.attr('fill-opacity',0);
        this.attr('stroke-opacity',0);

        rec.animate({
            "opacity" : 0,
            "fill" : "#ffffff",
            height : 0,
            width : 0
        });
        rec.hide();
        txt_price.hide();
        // txt_date.hide();

        circle.animate({
            r: r,
            "fill" : fill,
            "stroke" : stroke,
            "stroke-width": stroke_width
        }, SPEET);
    });
};

//=============================LINE==========================================

//create a Line object
function Line(startPoint, endPoint, color, stroke, strokeWidth, objPaper) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.color = color;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.paper = objPaper;
}

//convert Point to cordiator L0,0 M0,0
function convertToCordinatorString(point, isStartPoint) {
    var cordinator = point.x + ',' + point.y;
    if (isStartPoint) {
        return 'M' + cordinator;
    } else {
        return 'L' + cordinator;
    }
}

//create path from an array of Points
function createPath(startPoint, endPoint) {
    var result = "";

    result += convertToCordinatorString(startPoint, true);
    result += convertToCordinatorString(endPoint, false);

    return result;
}

//draw a line
Line.prototype.draw = function() {
    var line = this.paper.path(createPath(this.startPoint, this.endPoint)).attr({
        "fill" : this.fill, // filling the background color
        "stroke" : this.stroke, // the color of the border
        "stroke-width" : this.strokeWidth // the size of the border
    });
};

//==================================DRAW TEXT===============================

//text object
function Text(startPoint, rotation, text, fill, fontSize, bold, paper) {
    this.startPoint = startPoint;
    this.rotation = rotation;
    this.text = text;
    this.fill = fill;
    this.fontSize = fontSize;
    this.bold = bold;
    this.paper = paper;
}

//draw text
Text.prototype.draw = function() {
    var text = this.paper.text(this.startPoint.x, this.startPoint.y, this.text).attr({
        "fill" : this.fill, // font-color
        "font-size" : this.fontSize, // font size in pixels
        "text-anchor" : "middle",
        "font-family" : "SansPro" , // font family of the text
        "transform" : "r" + this.rotation,
        "font-weight": this.bold
    });
};

//=================================Rectangle==================================

function Rectangle(startPoint, width, height, fill, stroke, stroke_width, radius, opacity, paper){
    this.startPoint = startPoint;
    this.width = width;
    this.height = height;
    this.fill = fill;
    this.stroke = stroke;
    this.stroke_width = stroke_width;
    this.radius = radius;
    this.paper = paper;
    this.opacity = opacity;
}

Rectangle.prototype.draw = function(){
    var rec = this.paper.rect(this.startPoint.x, this.startPoint.y, this.width, this.height, this.radius).attr({
        "fill" : this.fill,
        "stroke" : this.stroke,
        "stroke-width": this.stroke_width,
        "opacity" : this.opacity

    });
};


//=================================curve======================================
function drawCurve(arrayPoint, fill, stroke_width, paper){
    var length = arrayPoint.length;
    var path = ['M', arrayPoint[0].x, arrayPoint[0].y];
    path.push('L');
    for(var i = 1;  i <  length; i++){
        path.push(arrayPoint[i].x);
        path.push(arrayPoint[i].y);
    }
    // path.push('L');
    // path.push(arrayPoint[length - 1].x);
    // path.push(DISTANCE_ROW * NUMBER_ROW + Y_START);
    // path.push('H');
    // path.push('50');
    // path.push('z');
    var curve = paper.path( path).attr({
            "stroke" : fill,
            "stroke-width": stroke_width,
            'stroke-linejoin': 'round'
            //"fill" : "270-#ecf3fd-#ffffff"
    });
}

/**
 *Define methods drawText, drawLine, drawBaseWeightLine, ......
 */
function drawText(p, text, rotation, fontSize, fontColor, bold, paper) {
    var TEXT_ANCHOR = "middle";
    text = new Text(p, rotation, text, fontColor, fontSize,  bold, paper);
    text.draw();
}

function drawLine(p1, p2, color, strokeWidth, paper) {
    var line = new Line(p1, p2, color, color, strokeWidth, paper);
    line.draw();
}

function drawDot(point, radius, fill, borderfill, borderStrong, paper, data){
    var greenDot = new Dot(point, radius, fill, borderfill, borderStrong, paper);
    greenDot.draw(data);
}

function drawRectangle(startPoint, width, height, fill, stroke, stroke_width, radius, opacity, paper){
    var rec = new Rectangle(startPoint, width, height, fill, stroke, stroke_width, radius, opacity, paper);
    rec.draw();
}

