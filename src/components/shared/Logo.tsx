import Link from 'next/link';
import Image from 'next/image';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  /**
   * Size of the logo
   * xs: h-10 (40px) - Used in void header
   * sm: h-12 (48px) - Used in scrolled headers
   * md: h-16 (64px) - Used in normal headers
   * lg: h-32 (128px) - Used in standalone displays
   * xl: h-48 (192px) - Used in main navigation
   */
  size?: LogoSize;
  /**
   * Link to homepage on click (default: true)
   */
  linkToHome?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Click handler (only used if linkToHome is false)
   */
  onClick?: () => void;
}

const sizeClasses: Record<LogoSize, string> = {
  xs: 'h-10',
  sm: 'h-12',
  md: 'h-16',
  lg: 'h-32',
  xl: 'h-48',
};

export default function Logo({
  size = 'md',
  linkToHome = true,
  className = '',
  onClick,
}: LogoProps) {
  const logoPath = '/logos/ba-logo-trans-white.png';
  const sizeClass = sizeClasses[size];
  const baseClasses = `${sizeClass} w-auto`;
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

  const logoElement = (
    <Image
      src={logoPath}
      alt="Bad Alien"
      width={200}
      height={200}
      priority
      className={combinedClasses}
    />
  );

  if (linkToHome) {
    return (
      <Link href="/" className="hover:opacity-80 transition-opacity">
        {logoElement}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="hover:opacity-80 transition-opacity">
        {logoElement}
      </button>
    );
  }

  return logoElement;
}
