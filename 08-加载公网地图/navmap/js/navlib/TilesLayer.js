define(["dojo/_base/declare",
        "esri/layers/tiled"],
    function (declare) {
        return declare(esri.layers.TiledMapServiceLayer, {
            _maptype:"",
            constructor: function (maptype) {
                this._maptype  = maptype;
                this.spatialReference = new esri.SpatialReference({ wkid: wkid });
                this.fullExtent = new esri.geometry.Extent(xmin,ymin,xmax,ymax, this.spatialReference);
                this.initialExtent = this.fullExtent;
                this.tileInfo = new  esri.layers.TileInfo({
                    "cols": 256,
                    "rows": 256,
                    "compressionQuality": 0,
                    "origin": {
                        "x": originx,
                        "y": originy
                    },
                    "spatialReference": this.spatialReference,
                    "lods": [{
                        "level": 0,
                        "resolution": 156543.033928,
                        "scale": 591657527.591555
                    },...]
                });
                this.loaded = true;
                this.onLoad(this);
            },
            getTileUrl: function (level, row, col) {
                var url = "";
                switch (this._maptype) {
                    case "img":
                        imgurl;
                        break;
                    case "cva":
                        cvaurl;
                        break;
                    default:
                        vecurl;
                        break;
                }
                return url;
            }
        });
    });