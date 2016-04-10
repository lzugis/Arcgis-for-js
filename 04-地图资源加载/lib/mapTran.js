
/**
 *wkt转化成arcgis的Point对象
 * @param wkt
 * @returns {Polyline}
 * @constructor
 */
function WktToPoint(wkt,spatialreference){
    var wktUtil = new WKTUtil();
    var pt = wktUtil.read(wkt);
    var json = {
        x:pt[0],
        y:pt[1],
        spatialReference: spatialreference
    }
    var point = new esri.geometry.Point(json);
    return point;
}
/**
 *wkt转化成arcgis的Polyline对象
 * @param wkt
 * @returns {Polyline}
 * @constructor
 */
function WktToPolyline(wkt, spatialreference){
    var wktUtil = new WKTUtil();
    var points = wktUtil.read(wkt);
    var json = {
        paths: [points],
        spatialReference: spatialreference
    }
    var polyline = new esri.geometry.Polyline(json);
    return polyline;
}
/**
 * wkt转化成arcgis的Polygon对象
 * @param wkt
 * @returns {Polygon}
 * @constructor
 */
function WktToPolygon(wkt, spatialreference){
    var wktUtil = new WKTUtil();
    var points = wktUtil.read(wkt);
    var json = {
        rings: points,
        spatialReference: {"wkid":4326}
    }
    var polygon = new esri.geometry.Polygon(json);
    return polygon;
}
/**
 * @param geometry
 */
function PointToWKT(geometry){
    console.log(geometry);
    return "POINT ("+geometry.x+" "+geometry.y+")";
}
/**
 * @param geometry
 */
function PolygonToWKT(geometry){
    var wkt = [];
    var rings = geometry.rings;
    for(var i in rings){
        var ring = rings[i];
        for(var j in ring){
            var p = ring[j];
            wkt.push(p.join(" "));
        }
    }
    return "POLYGON (("+wkt.join(",")+"))";
}

/**
 * @param geometry
 */
function LineToWKT(geometry){
    var wkt = [];
    var paths = geometry.paths;
    for(var i in paths){
        var path = paths[i];
        for(var j in path){
            var p = path[j];
            wkt.push(p.join(" "));
        }
    }
    return "LINESTRING ("+wkt.join(",")+")";
}