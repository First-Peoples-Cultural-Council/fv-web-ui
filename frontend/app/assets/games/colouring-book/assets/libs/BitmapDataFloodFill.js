/**
* This adds a Flood Fill function to a BitmapData object.
* 
* It will perform an iterative fill from the given x/y coordinate, at the given color.
* 
* If you specify the tolerance you can allow it to fill into semi-transparent areas.
*
* It will ignore fills on the color black, or onto the same color as the fill color given.
* 
* @param {integer} x - The x coordinate to begin the fill from.
* @param {integer} y - The y coordinate to begin the fill from.
* @param {integer} [red=255] - The red component of the fill color. A value between 0 and 255.
* @param {integer} [green=0] - The green component of the fill color. A value between 0 and 255.
* @param {integer} [blue=0] - The blue component of the fill color. A value between 0 and 255.
* @param {integer} [alpha=255] - The alpha component of the fill color. A value between 0 and 255.
* @param {integer} [tolerance=0] - The tolerance applied to the fill search. A value between 0 (no tolerance) and 255.
* @param {boolean} [ignoreBlack=true] - By default the fill routine will ignore black pixels, allowing you to flood-fill line art.
* @return {boolean} True if the flood fill routine ran, otherwise false.
*/
Phaser.BitmapData.prototype.floodFill = function (x, y, red, green, blue, alpha, tolerance, ignoreBlack) {

    if (red === undefined) { red = 255; }
    if (green === undefined) { green = 0; }
    if (blue === undefined) { blue = 0; }
    if (alpha === undefined) { alpha = 255; }
    if (tolerance === undefined || tolerance > 255) { tolerance = 0; }
    if (ignoreBlack === undefined) { ignoreBlack = true; }

    x = Math.floor(x);
    y = Math.floor(y);

    if (x < 0 || x >= this.width || y < 0 || y >= this.height)
    {
        return false;
    }

    var color = ((alpha << 24) | (blue << 16) | (green << 8) | red) >>> 0;

    if (!color || color > 0xffffffff)
    {
        color = 0xff0000ff;
    }

    if (color < 0)
    {
        color = color >>> 0;
    }

    var above, below, b, c, e, n;

    var b32 = this.pixels;

    var i = x + (y * this.width);
    var t = b32.length - this.width;

    var target = b32[i];

    if (target === color || (ignoreBlack && target === 0xff000000))
    {
        return false;
    }

    var queue = [i];

    if (tolerance === 0)
    {
        while (queue.length)
        {
            i = queue.pop();
            y = (i / this.width) >> 0;
            b = y * this.width;
            e = b + this.width;

            while (i >= b && b32[i] === target)
            {
                i--;
            }

            i++;
            above = 0;
            below = 0;

            while (i < e && b32[i] === target)
            {
                b32[i] = color;

                if (i >= this.width)
                {
                    n = i - this.width;

                    if (!above && b32[n] === target)
                    {
                        queue.push(n);
                        above = 1;
                    }
                    else if (above && b32[n] !== target)
                    {
                        above = 0;
                    }
                }

                if (i < t)
                {
                    n = i + this.width;

                    if (!below && b32[n] === target)
                    {
                        queue.push(n);
                        below = 1;
                    }
                    else if (below && b32[n] !== target)
                    {
                        below = 0;
                    }
                }

                i++;
            }
        }
    }
    else
    {
        n = i * 4;

        var pixel = new Uint8Array([this.data[n++], this.data[n++], this.data[n++], this.data[n]]);

        while (queue.length)
        {
            i = queue.pop();
            y = (i / this.width) >> 0;
            b = y * this.width;
            e = b + this.width;

            while (i >= b && this.compare(i * 4, tolerance, pixel))
            {
                i--;
            }
  
            i++;
            above = 0;
            below = 0;

            while (i < e && this.compare(i * 4, tolerance, pixel))
            {
                b32[i] = color;

                if (i >= this.width)
                {
                    n = i - this.width;
                    c = (b32[n] === color) ? false : this.compare(n * 4, tolerance, pixel);

                    if (!above && c)
                    {
                        queue.push(n);
                        above = 1;
                    }
                    else if (above && !c)
                    {
                        above = 0;
                    }
                }

                if (i < t)
                {
                    n = i + this.width;
                    c = (b32[n] === color) ? false : this.compare(n * 4, tolerance, pixel);

                    if (!below && c)
                    {
                        queue.push(n);
                        below = 1;
                    }
                    else if (below && !c)
                    {
                        below = 0;
                    }
                }

                i++;
            }
        }
    }

    this.ctx.putImageData(this.imageData, 0, 0);

    this.update();

    return true;

};

/**
* Extends the BitmapData object with a compare function required by the floodFill.
* 
* @param {integer} pos - The data index offset to check from.
* @param {integer} tolerance - The tolerance threshold (between 1 and 255)
* @param {Uint8Array} pixel - The pixel data to compare against.
* @return {boolean} True if the two pixel colors are within the tolerance range specified, otherwise false.
*/
Phaser.BitmapData.prototype.compare = function (pos, tolerance, pixel) {

    var red = pixel[0] - this.data[pos++];
    var green = pixel[1] - this.data[pos++];
    var blue = pixel[2] - this.data[pos++];
    var alpha = pixel[3] - this.data[pos];

    if (red < 0)
    {
        red = -red;
    }

    if (green < 0)
    {
        green = -green;
    }

    if (blue < 0)
    {
        blue = -blue;
    }

    if (alpha < 0)
    {
        alpha = -alpha;
    }

    return !(red > tolerance || green > tolerance || blue > tolerance || alpha > tolerance);

};
