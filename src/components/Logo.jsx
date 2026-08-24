import { Link } from 'react-router-dom'

export function Logo({ as = 'link', className = 'logo' }) {
  const content = (
    <>
      31ST<span>FAMILY CO.</span>
    </>
  )

  if (as === 'plain') {
    return <div className={className}>{content}</div>
  }

  return (
    <Link className={className} to="/" aria-label="31st Family Co, inicio">
      {content}
    </Link>
  )
}
