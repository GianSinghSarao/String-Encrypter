var Color = {
  fromHex: function (HexColorString) {
    return {
      R: parseInt('0x' + HexColorString.substring(1, 3)),
      G: parseInt('0x' + HexColorString.substring(3, 5)),
      B: parseInt('0x' + HexColorString.substring(5, 7)),
      A: parseInt('0x' +
        (HexColorString.length == 9 ?
          HexColorString.substring(7, 9)
          : 'ff'
        )
      )
    }
  },
  toHex: function (Color) {
    var hex = [
      Color.R.toString(16),
      Color.G.toString(16),
      Color.B.toString(16),
      Color.A.toString(16)
    ];
    for (var i = 0; i < hex.length; i++) {
      hex[i] = (hex[i].length < 2) ? ('0' + hex[i]) : (hex[i]);
    }
    return '#' + hex.join('');
  },
  fromABGRHexInt: function (integerValue) {
    var HexString = integerValue.toString(16);
    return {
      R: parseInt('0x' + HexString.substring(6, 8)),
      G: parseInt('0x' + HexString.substring(4, 6)),
      B: parseInt('0x' + HexString.substring(2, 4)),
      A: parseInt('0x' + HexString.substring(0, 2))
    }
  },
  getContrastingOf: function (Color) {
    var ChannelIntensity = (
      ((0.299 * Color.R + 0.587 * Color.G + 0.114 * Color.B) / 255) > 0.5
    ) ? 0 : 255;
    return {
      R: ChannelIntensity,
      G: ChannelIntensity,
      B: ChannelIntensity,
      A: 255
    };
  },
  flatten: function (FlatBackgroundColor, ForegroundColor) {
    return {
      R: Math.round(
        FlatBackgroundColor.R +
        (ForegroundColor.R - FlatBackgroundColor.R) *
        (ForegroundColor.A / 255)
      ),
      G: Math.round(
        FlatBackgroundColor.G +
        (ForegroundColor.G - FlatBackgroundColor.G) *
        (ForegroundColor.A / 255)
      ),
      B: Math.round(
        FlatBackgroundColor.B +
        (ForegroundColor.B - FlatBackgroundColor.B) *
        (ForegroundColor.A / 255)
      ),
      A: 255
    }
  }
}