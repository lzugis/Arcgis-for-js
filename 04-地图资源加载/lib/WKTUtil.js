var WKTUtil = function(options){
    this.initialize(options);
}

WKTUtil.prototype = {
    /**
     * Constructor: OpenLayers.Format.WKT
     * Create a new parser for WKT
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *           this instance
     *
     * Returns:
     * {<OpenLayers.Format.WKT>} A new WKT parser.
     */
    initialize: function(options) {
        this.regExes = {
            'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
            'spaces': /\s+/,
            'parenComma': /\)\s*,\s*\(/,
            'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/,  // can't use {2} here
            'trimParens': /^\s*\(?(.*?)\)?\s*$/
        };
        for(var i in options){
            this[i] = options[i];
        }
    },

    /**
     * APIMethod: read
     * Deserialize a WKT string and return a vector feature or an
     * array of vector features.  Supports WKT for POINT, MULTIPOINT,
     * LINESTRING, MULTILINESTRING, POLYGON, MULTIPOLYGON, and
     * GEOMETRYCOLLECTION.
     *
     * Parameters:
     * wkt - {String} A WKT string
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>|Array} A feature or array of features for
     * GEOMETRYCOLLECTION WKT.
     */
    read: function(wkt) {
        var features, type, str;
        wkt = wkt.replace(/[\n\r]/g, " ");
        var matches = this.regExes.typeStr.exec(wkt);
        if(matches) {
            type = matches[1].toLowerCase();
            str = matches[2];
            if(this.parse[type]) {
                features = this.parse[type].apply(this, [str]);
                //console.log(features);
            }


        }
        return features;
    },

    /**
     * Method: extractGeometry
     * Entry point to construct the WKT for a single Geometry object.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry.Geometry>}
     *
     * Returns:
     * {String} A WKT string of representing the geometry
     */
    extractGeometry: function(geometry) {
        var type = geometry.CLASS_NAME.split('.')[2].toLowerCase();
        if (!this.extract[type]) {
            return null;
        }
        if (this.internalProjection && this.externalProjection) {
            geometry = geometry.clone();
            geometry.transform(this.internalProjection, this.externalProjection);
        }
        var wktType = type == 'collection' ? 'GEOMETRYCOLLECTION' : type.toUpperCase();
        var data = wktType + '(' + this.extract[type].apply(this, [geometry]) + ')';
        return data;
    },

    trim: function(str){
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    /**
     * Object with properties corresponding to the geometry types.
     * Property values are functions that do the actual parsing.
     */
    parse: {
        /**
         * Return point feature given a point WKT fragment.
         * @param {String} str A WKT fragment representing the point
         * @returns {OpenLayers.Feature.Vector} A point feature
         * @private
         */
        'point': function(str) {
            var coords = this.trim(str).split(this.regExes.spaces);
            return coords;//new esri.geometry.Point(coords[0], coords[1]);
        },

        /**
         * Return a multipoint feature given a multipoint WKT fragment.
         * @param {String} str A WKT fragment representing the multipoint
         * @returns {OpenLayers.Feature.Vector} A multipoint feature
         * @private
         */
        'multipoint': function(str) {
            var point;
            var points = this.trim(str).split(',');
            var components = [];
            for(var i=0, len=points.length; i<len; ++i) {
                point = points[i].replace(this.regExes.trimParens, '$1');
                components.push(this.parse.point.apply(this, [point]).geometry);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.MultiPoint(components)
            );
        },

        /**
         * Return a linestring feature given a linestring WKT fragment.
         * @param {String} str A WKT fragment representing the linestring
         * @returns {OpenLayers.Feature.Vector} A linestring feature
         * @private
         */
        'linestring': function(str) {
            var points = this.trim(str).split(',');

            var components = [];
            for(var i=0, len=points.length; i<len; ++i) {
                components.push(this.parse.point.apply(this, [points[i]]));
            }
            return components//new esri.geometry.Polyline(components);
        },

        /**
         * Return a multilinestring feature given a multilinestring WKT fragment.
         * @param {String} str A WKT fragment representing the multilinestring
         * @returns {OpenLayers.Feature.Vector} A multilinestring feature
         * @private
         */
        'multilinestring': function(str) {
            var line;
            var lines = OpenLayers.String.trim(str).split(this.regExes.parenComma);
            var components = [];
            for(var i=0, len=lines.length; i<len; ++i) {
                line = lines[i].replace(this.regExes.trimParens, '$1');
                components.push(this.parse.linestring.apply(this, [line]).geometry);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.MultiLineString(components)
            );
        },

        /**
         * Return a polygon feature given a polygon WKT fragment.
         * @param {String} str A WKT fragment representing the polygon
         * @returns {OpenLayers.Feature.Vector} A polygon feature
         * @private
         */
        'polygon': function(str) {
            var ring, linestring, linearring;
            var rings = this.trim(str).split(this.regExes.parenComma);

            var components = [];
            for(var i=0, len=rings.length; i<len; ++i) {
                ring = rings[i].replace(this.regExes.trimParens, '$1');
                linestring = this.parse.linestring.apply(this, [ring]);
                components.push(linestring);
            }
            return components;
        }
    }
}