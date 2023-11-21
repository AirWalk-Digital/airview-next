
function getContrastYIQ(hexcolor, theme){

    if (typeof(hexcolor) === 'object') {
      hexcolor = hexcolor.toString(16);
    }
    var r = parseInt(hexcolor.substring(1,3),16);
    var g = parseInt(hexcolor.substring(3,5),16);
    var b = parseInt(hexcolor.substring(5,7),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? theme.palette.text.main : theme.palette.text.invtext;
  }
  export {getContrastYIQ}