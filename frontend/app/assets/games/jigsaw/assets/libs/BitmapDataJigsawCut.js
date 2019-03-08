Phaser.BitmapData.prototype.multiCall = function (contexts, func, args) {

    if (args === undefined) { args = []; }

    contexts.forEach(function(ctx) {
        ctx[func].apply(ctx, args);
    });

};

Phaser.BitmapData.prototype.multiSet = function (contexts, property, value) {

    contexts.forEach(function(ctx) {
        ctx[property] = value;
    });

};

Phaser.BitmapData.prototype.jigsawCut = function (hPieces, vPieces, lineWidth, lineStyle) {

    if (hPieces === undefined || hPieces < 2) { hPieces = 2; }
    if (vPieces === undefined || vPieces < 2) { vPieces = 2; }
    if (lineWidth === undefined) { lineWidth = 2; }
    if (lineStyle === undefined) { lineStyle = 'rgba(192, 192, 192, 0.4)'; }

    var i, j, n, shape, src, srcNoLine, ctx, ctx2;

    var pieces = [];

    var rw = (this.width  / hPieces) >> 0;
    var rh = (this.height / vPieces) >> 0;
    var hp = hPieces - 1;
    var vp = vPieces - 1;

    var lw = lineWidth;
    var ls = lineStyle;
    var lh = lw >> 1;

    var lx = (rw / 8) >> 0;
    var ly = (rh / 8) >> 0;
    var nx = lx * 2;
    var ny = ly * 2;

    var ox = nx + lh;
    var oy = ny + lh;
    var px = -nx;
    var py = -ny;

    var iw = (rw >> 3) * 8;
    var ih = (rh >> 3) * 8;

    var sx = 0;
    var sy = 0;
    var dx = nx;
    var dy = ny;
    var cw = iw + dx;
    var ch = ih + dy;

    var co = {
        x2:   2 * lx,
        x3:   3 * lx - lh,
        x4:   4 * lx - lh,
        x5:   5 * lx - lh,
        x6:   6 * lx - lh,
        x8:   8 * lx - lw,
        x10: 10 * lx - lw,
        y2:   2 * ly,
        y3:   3 * ly - lh,
        y4:   4 * ly - lh,
        y5:   5 * ly - lh,
        y6:   6 * ly - lh,
        y8:   8 * ly - lw,
        y10: 10 * ly - lw
    };

    rw = iw + (nx * 2);
    rh = ih + (ny * 2);

    iw -= lw;
    ih -= lw;

    for (i = 0; i < hPieces; i++)
    {
        pieces[i] = [];

        for (j = 0; j < vPieces; j++)
        {
            src = document.createElement('canvas');
            src.width  = rw;
            src.height = rh;

            srcNoLine = document.createElement('canvas');
            srcNoLine.width  = rw;
            srcNoLine.height = rh;

            ctx = src.getContext('2d');
            ctx2 = srcNoLine.getContext('2d');

            this.multiSet([ctx, ctx2], 'fillStyle', '#fff');
            this.multiSet([ctx, ctx2], 'lineCap', 'round');
            this.multiSet([ctx, ctx2], 'lineJoin', 'round');
            this.multiSet([ctx, ctx2], 'lineWidth', lw);
            this.multiSet([ctx, ctx2], 'miterLimit', 1);
            this.multiSet([ctx, ctx2], 'strokeStyle', ls);

            shape = {
                down:  Math.floor(Math.random() * 2),
                right: Math.floor(Math.random() * 2)
            };

            this.multiCall([ctx, ctx2], 'beginPath');
            this.multiCall([ctx, ctx2], 'moveTo', [ox, oy]);

            if (j)
            {
                dy = 0;
                ch = rh;

                shape.up = 1 - pieces[i][j - 1].down;

                if (shape.up === 1)
                {
                    n = oy - co.y2;
                }
                else
                {
                    n = oy + co.y2;
                }

                this.multiCall([ctx, ctx2], 'lineTo', [ox + co.x3, oy]);
                this.multiCall([ctx, ctx2], 'quadraticCurveTo', [ox + co.x2, n, ox + co.x4, n]);
                this.multiCall([ctx, ctx2], 'quadraticCurveTo', [ox + co.x6, n, ox + co.x5, oy]);
            }
            else
            {
                ch = rh - ny;
            }

            this.multiCall([ctx, ctx2], 'lineTo', [ox + co.x8, oy]);

            if (i !== hp)
            {
                if (shape.right === 1)
                {
                    n = ox + co.x10;
                }
                else
                {
                    n = ox + co.x6;
                }

                this.multiCall([ctx, ctx2], 'lineTo', [ox + co.x8, oy + co.y3]);
                this.multiCall([ctx, ctx2], 'quadraticCurveTo', [n, oy + co.y2, n, oy + co.y4]);
                this.multiCall([ctx, ctx2], 'quadraticCurveTo', [n, oy + co.y6, ox + co.x8, oy + co.y5]);
            }
            else
            {
                cw = rw - nx;
            }

            this.multiCall([ctx, ctx2], 'lineTo', [ox + co.x8, oy + co.y8]);

            if (j !== vp)
            {
                if (shape.down === 1)
                {
                    n = oy + co.y10;
                }
                else
                {
                    n = oy + co.y6;
                }

                this.multiCall([ctx, ctx2], 'lineTo', [ox + co.x5, oy + co.y8]);
                this.multiCall([ctx, ctx2], 'quadraticCurveTo', [ox + co.x6, n, ox + co.x4, n]);
                this.multiCall([ctx, ctx2], 'quadraticCurveTo', [ox + co.x2, n, ox + co.x3, oy + co.y8]);
            }
            else
            {
                ch = rh - ny;
            }

            this.multiCall([ctx, ctx2], 'lineTo', [ox, oy + co.y8]);

            if (i)
            {
                shape.left = 1 - pieces[i - 1][j].right;

                if (shape.left === 1)
                {
                    n = ox - co.x2;
                }
                else
                {
                    n = ox + co.x2;
                }

                this.multiCall([ctx, ctx2], 'lineTo', [ox, oy + co.y5]);
                this.multiCall([ctx, ctx2], 'quadraticCurveTo', [n, oy + co.y6, n, oy + co.y4]);
                this.multiCall([ctx, ctx2], 'quadraticCurveTo', [n, oy + co.y2, ox, oy + co.y3]);
            }

            this.multiCall([ctx, ctx2], 'lineTo', [ox, oy]);
            this.multiCall([ctx, ctx2], 'closePath');

            this.multiCall([ctx, ctx2], 'fill');
            this.multiSet([ctx, ctx2], 'globalCompositeOperation', 'source-in');
            this.multiCall([ctx, ctx2], 'drawImage', [this.canvas, sx, sy, cw, ch, dx, dy, cw, ch]);
            this.multiSet([ctx, ctx2], 'globalCompositeOperation', 'source-over');
            this.multiCall([ctx], 'stroke');

            shape.canvas = src;
            shape.canvasNoOutline = srcNoLine;
            shape.x = px;
            shape.y = py;
            shape.cx = Math.floor(src.width / 2);
            shape.cy = Math.floor(src.height / 2);

            sy = (py += ih);

            pieces[i][j] = shape;
        }

        px += iw;
        py = -ny;

        sx = px;
        sy = 0;
        dx = 0;
        dy = ny;
        cw = rw;
        ch = ih;
    }

    return { "width": (iw * hPieces) + lw, "height": (ih * vPieces) + lw, "pieces": pieces };

};
