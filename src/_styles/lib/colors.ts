import type { Theme } from '@mui/material/styles';

function getContrastYIQ(
  hexcolor: string | number | object,
  theme: Theme
): string {
  let color: string;
  if (typeof hexcolor === 'object') {
    color = hexcolor.toString();
  } else if (typeof hexcolor === 'number') {
    color = hexcolor.toString(16);
  } else {
    color = hexcolor;
  }
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? theme.palette.text.primary : theme.palette.text.secondary;
}

export { getContrastYIQ };
