import Button, { type ButtonProps } from '@mui/material/Button'

export function AppButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        color: 'primary.contrastText',
        fontWeight: 800,
        letterSpacing: 0,
        ...props.sx,
      }}
    />
  )
}
