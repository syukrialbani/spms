import Button, { type ButtonProps } from '@mui/material/Button'

export function AppButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      {...props}
      sx={{
        fontWeight: 600,
        letterSpacing: 0,
        ...props.sx,
      }}
    />
  )
}
