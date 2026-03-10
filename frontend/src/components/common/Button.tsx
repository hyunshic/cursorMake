import { ButtonHTMLAttributes } from 'react'
import './Button.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ className = '', type = 'button', ...props }: ButtonProps) => {
  const mergedClassName = ['app-button', className].join(' ').trim()

  return <button type={type} className={mergedClassName} {...props} />
}

export default Button
