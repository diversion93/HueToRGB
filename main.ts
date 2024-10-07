//% weight=100 color=#0fbc11 icon="\uf1fc" block="ColorConverter"
namespace ColorConverter {
    /**
     * Konvertiert einen Farbton (Hue) und eine Zielhelligkeit (Brightness) in RGB.
     * Die Sättigung und Helligkeit können innerhalb der Funktion angepasst werden.
     * @param hue Farbton von 0 bis 360
     * @param brightness Zielhelligkeit, die für die RGB-Werte angepasst wird (zwischen 0 und 255).
     * @returns Ein RGB-Wert zur Verwendung mit basic.setLedColor()
     */
    //% block="Farbton zu RGB $hue bei Zielhelligkeit $brightness"
    export function HueToRGBWithBrightness(hue: number, brightness: number): number {
        // Legen Sie die Standardwerte für Sättigung und Helligkeit fest
        let saturation = 100;  // Sättigung (zwischen 0 und 100)
        let lightness = 50;    // Helligkeit (zwischen 0 und 100)

        // Konvertiere HSL zu RGB mit angepasster Helligkeit
        let rgb = hslToRgbBalanced(hue, saturation, lightness, brightness);
        return basic.rgb(rgb[0], rgb[1], rgb[2]);
    }

    /**
     * Interne Funktion zur Umwandlung von HSL zu RGB mit Helligkeitsanpassung.
     * @param h Farbton (Hue), zwischen 0 und 360
     * @param s Sättigung, zwischen 0 und 100
     * @param l Helligkeit, zwischen 0 und 100
     * @param targetBrightness Zielhelligkeit zur Anpassung (zwischen 0 und 255)
     * @returns Ein Array mit den RGB-Werten [R, G, B].
     */
    function hslToRgbBalanced(h: number, s: number, l: number, targetBrightness: number): number[] {
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

        return adjustBrightness(r, g, b, targetBrightness);
    }

    /**
     * Passt die RGB-Werte an, um eine gleichmäßige Helligkeit zu erreichen.
     * @param r Rotanteil des RGB-Wertes (zwischen 0 und 255).
     * @param g Grünanteil des RGB-Wertes (zwischen 0 und 255).
     * @param b Blauanteil des RGB-Wertes (zwischen 0 und 255).
     * @param targetBrightness Der Zielwert für die Helligkeit (zwischen 0 und 255).
     * @returns Ein Array mit den angepassten RGB-Werten [R, G, B].
     */
    function adjustBrightness(r: number, g: number, b: number, targetBrightness: number): number[] {
        let perceivedBrightness = 0.299 * r + 0.587 * g + 0.114 * b;
        let adjustmentFactor = targetBrightness / perceivedBrightness;
        let newR = Math.min(255, r * adjustmentFactor);
        let newG = Math.min(255, g * adjustmentFactor);
        let newB = Math.min(255, b * adjustmentFactor);
        return [Math.round(newR), Math.round(newG), Math.round(newB)];
    }
}