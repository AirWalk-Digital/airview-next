import Box from '@mui/material/Box';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import React from 'react';

function getImageBrightness(imageSrc,callback) {
  var img = document.createElement("img");
  img.src = imageSrc;
  img.style.display = "none";
  document.body.appendChild(img);

  var colorSum = 0;

  img.onload = function() {
      // create canvas
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(this,0,0);

      var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
      var data = imageData.data;
      var r,g,b,avg;

        for(var x = 0, len = data.length; x < len; x+=4) {
          r = data[x];
          g = data[x+1];
          b = data[x+2];

          avg = Math.floor((r+g+b)/3);
          colorSum += avg;
      }

      var brightness = Math.floor(colorSum / (this.width*this.height));
      callback(brightness);
  }
};

export const TitleSlide = ({ background = 'image1.jpeg', color = 'white', children, sx = {} }) => {
  const [textColor, setTextColor] = useState(0)
  const [awLogo, setAwLogo] = useState('/logos/airwalk-logo-negative.png')

  console.log('background : ', background)

  useEffect(() => {
    var imgs = document.body.getElementsByTagName('img');
    getImageBrightness(imgs[0].src,function(brightness) {
      if (brightness < 100) {
        setTextColor('text.invtext')
      } else {
        setTextColor('text.main')
        setAwLogo('/logos/airwalk-logo.png')
      }
      // console.log('brightness : ', brightness);
  }); 
        
  })
  const titleSlideSX = {
    h1: {
      backgroundColor: 'unset',
      margin: '25px',
      mt: '20%',
      mb: '10%',
      textAlign: 'left',
      fontSize: '4rem',
      fontWeight: 200,
      color: textColor,
      px: 0,

    },
    span: {
      margin: '25px',
      textAlign: 'left',
      fontSize: '2.5rem',
      color: textColor,
      mixBlendMode: 'difference'
    },
    p : {
    },
    pre: {code : { span : {color: 'white'}}}
  };

  

return (
  <Box>
<Image alt='background' src={'/backgrounds/' + background} fill/>
  <Box sx={{ display: "flex", flexDirection: "column", height: "80%", width: "50%", alignItems: "left", position: "absolute", top: "5%", left: "5%" }}>
        <Box sx={{ filter: 'grayscale(1)', ...titleSlideSX , ...sx }}>
          {children}
        </Box>

        <Box sx={{ position: "absolute", bottom: "0", display: "flex", height: "15%", width: "40%" }}>

          <Box sx={{ mx: "2%" }}>
          <Image alt='airwalk logo' src={awLogo} fill style={{objectFit: 'contain', marginLeft: "5%"}}  />
            
            
          </Box>
          <Box sx={{ mx: "2%" }}>
          <Image alt='customer logo' src={'/logos/customer-logo.png'} fill style={{objectFit: 'contain', marginLeft: "5%"}} />
          </Box>

        </Box>

      </Box>
      </Box>
);

};
