define([
    "dojo/_base/declare",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "MapChart/MapChartGraphic"
], function (
    declare,
    GraphicsLayer,
    Point,
    MapChartGraphic
    ) {
    return declare([GraphicsLayer], {
        constructor: function(options) {
            this._id = options.id || "";
            this._divId = options.chartDiv || "chart";
        },
        // 重构esri/layers/GraphicsLayer方法
        _setMap: function(map, surface) {
            // GraphicsLayer will add its own listener here
            var div = this.inherited(arguments);
            return div;
        },
        _unsetMap: function() {
            this.inherited(arguments);
        },
        hide: function() {
            var _thisGraphic = this.graphics;
            var length = _thisGraphic.length;
            for (var i = 0; i < length; i++) {
                if (_thisGraphic[i]._chartDiv) {
                    dojo.style(_thisGraphic[i]._chartDiv, {
                        "display": "none"
                    });
                }
            }
        },
        show: function() {
            var length = this.graphics.length;
            var _thisGraphic = this.graphics;
            for (var i = 0; i < length; i++) {
                if (_thisGraphic[i]._chartDiv) {
                    dojo.style(_thisGraphic[i]._chartDiv, {
                        "display": ""
                    });
                }
            }
        },
        //拖拽
        _onPanStartHandler: function() {
            this.hide();
        },
        //缩放
        _onZoomStartHandler:function(){
            this.hide();
        },
        _onExtentChangeHandler: function(delta, extent, levelChange, lod) {
            this._refresh(true, levelChange);
        },
        _refresh: function(redrawFlag, zoomFlag) {
            var that=this;
            var gs = this.graphics,
                _draw = this._draw;

            for (i = 0; i < gs.length; i++) {
                _draw(gs[i], redrawFlag, zoomFlag);
            }
            this.show();
        },
        _draw:function(graphic, redrawFlag, zoomFlag){
            if (!this._map) {
                return;
            }
            if(graphic instanceof MapChartGraphic)//判断graphic是否为MapChartGraphic类型
            {
                this._drawChart(graphic, redrawFlag, zoomFlag);
            }
        },
        _drawChart:function(graphic, redrawFlag, zoomFlag){
            var _attribute = graphic._attribute;
            if (zoomFlag) {
                dojo.byId(this._divId).removeChild(graphic._chartDiv);
            }
            if (!_attribute) {
                return;
            }
            else
            {
                var _mapExtent = graphic._map.extent;
                var _showPt = new Point(graphic._attribute.x, graphic._attribute.y, graphic._sr);
                var _showScrPt = graphic._map.toScreen(_showPt);
                /*//1.根据Geometry设置图表大小
                 var _minPt = new esri.geometry.Point(_gExtent.xmin, _gExtent.ymin, map.spatialReference);
                 var _maxPt = new esri.geometry.Point(_gExtent.xmax, _gExtent.ymax, map.spatialReference);
                 var _scrMinPt = map.toScreen(_minPt), _scrMaxPt = map.toScreen(_maxPt);
                 var _gWidth = Math.abs((_scrMaxPt.x-_scrMinPt.x))/3, _gHeight =Math.abs((_scrMinPt.y-_scrMaxPt.y))/3;
                 var _chartSize = _gWidth < _gHeight ? _gWidth : _gHeight;//取最小的*/
                //2.固定大小的图表
                var _chartSize = graphic._size;
                //3.随着缩放的设置图表大小
                // var _chartSize = 10*map.getLevel()-40;

                if (!graphic._chartDiv || zoomFlag) {
                    var _chartDiv = dojo.doc.createElement("div");
                    dojo.style(_chartDiv, {
                        "left": (_showScrPt.x-_chartSize/4) + "px",
                        "top": (_showScrPt.y-_chartSize/2) + "px",
                        "position": "absolute",
                        "width": _chartSize + "px",
                        "height": _chartSize + "px"
                    });
                    dojo.byId(this._divId).appendChild(_chartDiv);
                    graphic._draw(_chartDiv);
                    graphic._chartDiv = _chartDiv;
                }
                else{
                    dojo.byId(this._divId).removeChild(graphic._chartDiv);
                    graphic._chartDiv = null;
                }
            }
        }
    });
});
