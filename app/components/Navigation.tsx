'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '홈', icon: '🏠' },
    { href: '/demo', label: 'A/B 테스트', icon: '📊' },
    { href: '/analysis', label: '분석 결과', icon: '📈' },
    { href: '/report', label: '보고서', icon: '📄' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🔍</span>
          <span className={styles.logoText}>행태감지 시스템</span>
        </Link>
        <ul className={styles.menu}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.link} ${
                  pathname === item.href ? styles.active : ''
                }`}
              >
                {/* <span className={styles.icon}>{item.icon}</span> */}
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

