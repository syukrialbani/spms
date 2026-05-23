import TextField, { type TextFieldProps } from '@mui/material/TextField'

export function FormTextField(props: TextFieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.52)',
        },
        ...props.sx,
      }}
    />
  )
}
