define(["dojo/_base/declare",
        "esri/layers/tiled"],
    function (declare) {
        return declare(esri.layers.TiledMapServiceLayer, {
            _maptype:"",
            constructor: function (maptype) {
                this._maptype  = maptype;
                this.spatialReference = new esri.SpatialReference({ wkid: 102100 });
                this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892, this.spatialReference));
                this.scale = [591657527.591555,295828763.795777,147914381.897889,73957190.948944,36978595.474472,18489297.737236,9244648.868618,
                    4622324.434309,2311162.217155,1155581.108577,577790.554289,288895.277144,144447.638572,72223.819286,
                    36111.9096437,18055.9548224,9027.977411,4513.988705,2256.994353,1128.497176];
                this.resolution = [156543.033928,78271.5169639999,39135.7584820001,19567.8792409999,9783.93962049996,4891.96981024998,2445.98490512499,
                    1222.99245256249,611.49622628138,305.748113140558,152.874056570411,76.4370282850732,38.2185141425366,19.1092570712683,9.55462853563415,
                    4.77731426794937,2.38865713397468,1.19432856685505,0.597164283559817,0.298582141647617];
                this.tileInfo = new esri.layers.TileInfo({
                    "rows": 256,
                    "cols": 256,
                    "compressionQuality": 90,
                    "origin": {
                        "x": -20037508.3427892,
                        "y": 20037508.3427892
                    },
                    "spatialReference": this.spatialReference,
                    "lods": [{ "level": 0, "resolution": this.resolution[0], "scale": this.scale[0] },
                        { "level": 1, "resolution": this.resolution[1], "scale": this.scale[1] },
                        { "level": 2, "resolution": this.resolution[2], "scale": this.scale[2] },
                        { "level": 3, "resolution": this.resolution[3], "scale": this.scale[3] },
                        { "level": 4, "resolution": this.resolution[4], "scale": this.scale[4] },
                        { "level": 5, "resolution": this.resolution[5], "scale": this.scale[5] },
                        { "level": 6, "resolution": this.resolution[6], "scale": this.scale[6] },
                        { "level": 7, "resolution": this.resolution[7], "scale": this.scale[7] },
                        { "level": 8, "resolution": this.resolution[8], "scale": this.scale[8] },
                        { "level": 9, "resolution": this.resolution[9], "scale": this.scale[9] },
                        { "level": 10, "resolution": this.resolution[10], "scale": this.scale[10] },
                        { "level": 11, "resolution": this.resolution[11], "scale": this.scale[11] },
                        { "level": 12, "resolution": this.resolution[12], "scale": this.scale[12] },
                        { "level": 13, "resolution": this.resolution[13], "scale": this.scale[13] },
                        { "level": 14, "resolution": this.resolution[14], "scale": this.scale[14] },
                        { "level": 15, "resolution": this.resolution[15], "scale": this.scale[15] },
                        { "level": 16, "resolution": this.resolution[16], "scale": this.scale[16] },
                        { "level": 17, "resolution": this.resolution[17], "scale": this.scale[17] },
                        { "level": 18, "resolution": this.resolution[18], "scale": this.scale[18] },
                        { "level": 19, "resolution": this.resolution[19], "scale": this.scale[19] }
                    ]
                });
                this.loaded = true;
                this.onLoad(this);
            },
            getTileUrl: function (level, row, col) {
                var zoom = level - 1;
                var offsetX = parseInt(Math.pow(2, zoom));
                var offsetY = offsetX - 1;
                var numX = col - offsetX, numY = (-row) + offsetY ;
                var num = (col + row) % 8 + 1;
                var tileurl = "";
                if(this._maptype==="img"){//影像
                    tileurl = "http://shangetu" + num + ".map.bdimg.com/it/u=x="+numX+";y="+numY+";z="+level+";v=009;type=sate&fm=46&udt=20141015";
                }
                else if(this._maptype==="cva"){//标注
                    tileurl = "http://online" + num + ".map.bdimg.com/tile/?qt=tile&x="+numX+"&y="+numY+"&z="+level+"&styles=sl&udt=20141015";
                }
                else{//矢量
                    tileurl = "http://online" + num + ".map.bdimg.com/tile/?qt=tile&x="+numX+"&y="+numY+"&z="+level+"&styles=pl&scaler=1&udt=20141103";
                }
                return tileurl;
            }
        });
    });