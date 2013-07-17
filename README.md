# Guides.js

http://emrouz.github.io/guides/

**Update**: This didn't use to work without the `--disable-web-security` flag as it would complain when loading the `styles.less` file. CSS is now loaded inline to prevent this, but some sites with a Content Security Policy directive can still refuse to load the JS. Best to just use the `--disable-web-secuirty` flag duing development if needed..
