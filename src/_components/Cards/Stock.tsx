'use client';

import { Box, Button, Typography } from '@mui/material';
import React from 'react';

export interface StockProps {
  symbol: string;
  price: number;
  delta: number;
}

export function Stock({ symbol, price, delta }: StockProps) {
  // const [, setMessages] = useState([]);

  // const submitUserMessage = (txt: string) => {
  //   // console.log(`Dummy function called ${txt}`);
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        p: 2,
        bgcolor: 'zinc.800',
        ':hover': { bgcolor: 'zinc.700' },
        width: { sm: 52 },
      }}
    >
      <Button
        key={symbol}
        // onClick={async () => {
        //   const response = await submitUserMessage(`View ${symbol}`);
        //   setMessages((currentMessages) => [...currentMessages, response]);
        // }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 2,
            fontSize: 'xl',
            color: delta > 0 ? 'green.600' : 'red.600',
            bgcolor: 'white.10',
            width: 11,
            borderRadius: 'md',
          }}
        >
          {delta > 0 ? '↑' : '↓'}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: 'zinc.300',
            }}
          >
            {symbol}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: 'base', color: 'zinc.500' }}
          >
            ${price.toExponential(1)}
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              textAlign: 'right',
              textTransform: 'uppercase',
              color: delta > 0 ? 'green.600' : 'red.600',
            }}
          >
            {` ${((delta / price) * 100).toExponential(1)}%`}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'right',
              fontSize: 'base',
              color: delta > 0 ? 'green.700' : 'red.700',
            }}
          >
            {delta.toExponential(1)}
          </Typography>
        </Box>
      </Button>
    </Box>
  );
}
