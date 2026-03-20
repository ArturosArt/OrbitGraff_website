export default function MenuToggle({ isMenuOpen, onToggle }) {
  return (
    <button
      aria-controls="site-nav"
      aria-expanded={isMenuOpen}
      aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      className="menu-toggle"
      type="button"
      onClick={onToggle}
    >
      <span className="menu-toggle-label">Menu</span>
      <span className="menu-toggle-icon" aria-hidden="true">
        <span />
        <span />
      </span>
    </button>
  )
}
