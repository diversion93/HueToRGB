namespace hueToRGB {
    /**
     * Konvertiert einen Hue-Wert in einen RGB-Wert
     * @param hue Farbton von 0 bis 360
     */
    //% block
    export function hueToRGB(hue: number): number {
        let saturation = 100;
        let lightness = 50;
        let rgb = hslToRgb(hue, saturation, lightness);
        return basic.rgb(rgb[0], rgb[1], rgb[2]);
    }

    function hslToRgb(h: number, s: number, l: number): number[] {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s;
        let hPrime = h / 60;
        let x = c * (1 - Math.abs((hPrime % 2) - 1));
        let r1 = 0, g1 = 0, b1 = 0;

        if (0 <= hPrime && hPrime < 1) {
            r1 = c; g1 = x; b1 = 0;
        } else if (1 <= hPrime && hPrime < 2) {
            r1 = x; g1 = c; b1 = 0;
        } else if (2 <= hPrime && hPrime < 3) {
            r1 = 0; g1 = c; b1 = x;
        } else if (3 <= hPrime && hPrime < 4) {
            r1 = 0; g1 = x; b1 = c;
        } else if (4 <= hPrime && hPrime < 5) {
            r1 = x; g1 = 0; b1 = c;
        } else if (5 <= hPrime && hPrime < 6) {
            r1 = c; g1 = 0; b1 = x;
        }

        let m = l - c / 2;
        let r = Math.round((r1 + m) * 255);
        let g = Math.round((g1 + m) * 255);
        let b = Math.round((b1 + m) * 255);

        return [r, g, b];
    }
}
