<template>
  <div class="footer">
    <div class="footer-content">
      <div class="footer-info">
        <p class="copyright">
          Copyright © {{ year }} <a href="https://github.com/zhaozhuoboy" target="_blank" class="author-link">MockTools - By zhaozhuo</a>
        </p>
      </div>
      <div class="footer-links">
        <a href="https://github.com/zhaozhuoboy" target="_blank" class="footer-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <a href="#" class="footer-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          文档
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'common-footer',
  setup () {
    const year = new Date().getFullYear()

    return {
      year
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  background: var(--card-hover);
  border-top: 1px solid var(--border);
  padding: 24px 0;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-info {
  flex: 1;
  min-width: 200px;
}

.copyright {
  margin: 0;
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.5;
}

.author-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary-hover);
    text-decoration: underline;
  }
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 6px;
  
  &:hover {
    color: var(--primary);
    background: var(--primary-tint-1);
    transform: translateY(-1px);
  }
  
  svg {
    flex-shrink: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer {
    padding: 20px 0;
  }
  
  .footer-content {
    padding: 0 16px;
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .footer-info {
    min-width: auto;
  }
  
  .footer-links {
    gap: 20px;
  }
  
  .footer-link {
    padding: 6px 10px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 16px 0;
  }
  
  .footer-content {
    padding: 0 12px;
    gap: 16px;
  }
  
  .footer-links {
    gap: 16px;
  }
  
  .footer-link {
    padding: 4px 8px;
    font-size: 12px;
  }
  
  .copyright {
    font-size: 13px;
  }
}
</style>
